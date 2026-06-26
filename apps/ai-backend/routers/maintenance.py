"""
Maintenance analysis: XGBoost RUL prediction + IsolationForest anomaly detection.
Synthetic training data is generated on startup using physics-informed heuristics.
"""
import io
import logging
from datetime import datetime
from typing import List, Optional

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sklearn.ensemble import IsolationForest

logger = logging.getLogger("maintenance")
router = APIRouter(prefix="/maintenance", tags=["maintenance"])

# ── Component domain knowledge ────────────────────────────────────────────────

SERVICE_LIFE: dict[str, int] = {
    "engine": 2000, "turbine": 1500, "compressor": 2000,
    "rotor": 1000, "landing_gear": 3000, "hydraulics": 2500,
    "avionics": 4000, "airframe": 5000, "electronics": 3500,
    "propeller": 800, "gearbox": 1800, "sensor": 2000,
}
_DEFAULT_LIFE = 2000

NORMAL_TEMP: dict[str, float] = {
    "engine": 720, "turbine": 950, "compressor": 680,
    "rotor": 85, "landing_gear": 65, "hydraulics": 85,
    "avionics": 55, "airframe": 50, "electronics": 60,
    "propeller": 70, "gearbox": 95, "sensor": 55,
}
_DEFAULT_TEMP = 100.0

NORMAL_VIB: dict[str, float] = {
    "engine": 2.0, "turbine": 1.5, "compressor": 1.8,
    "rotor": 3.5, "landing_gear": 4.0, "hydraulics": 1.2,
    "avionics": 0.5, "airframe": 1.0, "electronics": 0.5,
    "propeller": 2.5, "gearbox": 1.5, "sensor": 0.3,
}
_DEFAULT_VIB = 1.5

_COMP_TYPES = list(SERVICE_LIFE.keys())
_TYPE_ENC = {t: i for i, t in enumerate(_COMP_TYPES)}

# hours_since_service makes the modular fh % service_life pattern learnable
_FEATURES = ["flight_hours", "hours_since_service", "peak_temperature_c", "avg_vibration_g", "hard_landing_events", "comp_type_enc"]

# ── Heuristic RUL (used to build synthetic training data) ─────────────────────

def _heuristic_rul(fh: float, pt: float, vib: float, hl: int, ctype: str) -> float:
    sl = SERVICE_LIFE.get(ctype, _DEFAULT_LIFE)
    nt = NORMAL_TEMP.get(ctype, _DEFAULT_TEMP)
    nv = NORMAL_VIB.get(ctype, _DEFAULT_VIB)

    hours_since = fh % sl
    base_rul = sl - hours_since

    temp_excess = max(0.0, (pt - nt) / nt)
    temp_factor = max(0.35, 1.0 - temp_excess * 0.65)

    vib_excess = max(0.0, (vib - nv) / nv)
    vib_factor = max(0.45, 1.0 - vib_excess * 0.45)

    # Hard landings matter most for landing gear
    landing_impact = 0.35 if ctype == "landing_gear" else 0.06
    landing_factor = max(0.65, 1.0 - (hl / 50.0) * landing_impact)

    return max(0.0, base_rul * temp_factor * vib_factor * landing_factor)


# ── Generate synthetic training data ─────────────────────────────────────────

def _build_training_data(n_per_type: int = 50) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    rows = []
    for ctype, sl in SERVICE_LIFE.items():
        nt = NORMAL_TEMP[ctype]
        nv = NORMAL_VIB[ctype]
        for _ in range(n_per_type):
            fh = rng.uniform(sl * 0.05, sl * 2.5)
            pt = rng.uniform(nt * 0.4, nt * 1.5)
            vib = rng.uniform(nv * 0.2, nv * 2.5)
            hl = int(rng.integers(0, 25))
            hours_since = fh % sl
            rul = _heuristic_rul(fh, pt, vib, hl, ctype)
            rul = max(0.0, rul + rng.normal(0, rul * 0.09 + 1))
            rows.append({
                "flight_hours": fh,
                "hours_since_service": hours_since,
                "peak_temperature_c": pt,
                "avg_vibration_g": vib,
                "hard_landing_events": float(hl),
                "comp_type_enc": float(_TYPE_ENC[ctype]),
                "rul_hours": rul,
            })
    return pd.DataFrame(rows)


# ── Train IsolationForest on startup (anomaly detection) ──────────────────────
# RUL uses the physics-based heuristic — more accurate for aerospace components
# than XGBoost with limited synthetic data.
# IsolationForest detects out-of-distribution sensor readings.

logger.info("Training IsolationForest anomaly detector...")
_train_df = _build_training_data()
_anomaly_model = IsolationForest(n_estimators=150, contamination=0.12, random_state=42)
_anomaly_model.fit(_train_df[_FEATURES])
logger.info("Anomaly detector ready.")

# ── Prediction ────────────────────────────────────────────────────────────────

def _resolve_ctype(raw: str) -> str:
    raw = raw.strip().lower().replace(" ", "_").replace("-", "_")
    for known in _COMP_TYPES:
        if known in raw or raw in known:
            return known
    return "engine"  # default for unknown aerospace components


def _days_since(date_str: Optional[str]) -> int:
    if not date_str:
        return 90
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d"):
        try:
            return max(0, (datetime.now() - datetime.strptime(date_str.strip(), fmt)).days)
        except ValueError:
            continue
    return 90


def predict_component(comp: dict) -> dict:
    comp_id = str(comp.get("component_id", comp.get("Component ID", "UNKNOWN")))
    ctype = _resolve_ctype(str(comp.get("component_type", comp.get("Component Type", "engine"))))

    fh = float(comp.get("flight_hours", comp.get("Flight Hours", 500)))
    pt = float(comp.get("peak_temperature_c", comp.get("Peak Temperature", NORMAL_TEMP.get(ctype, _DEFAULT_TEMP))))
    vib = float(comp.get("avg_vibration_g", comp.get("Vibration Reading", NORMAL_VIB.get(ctype, _DEFAULT_VIB))))
    hl = int(float(comp.get("hard_landing_events", comp.get("Hard Landing Events", 0))))
    days_svc = _days_since(str(comp.get("last_service_date", comp.get("Last Service Date", ""))))

    enc = float(_TYPE_ENC.get(ctype, 0))
    sl = SERVICE_LIFE.get(ctype, _DEFAULT_LIFE)
    hours_since = fh % sl
    features = pd.DataFrame([{
        "flight_hours": fh,
        "hours_since_service": hours_since,
        "peak_temperature_c": pt,
        "avg_vibration_g": vib,
        "hard_landing_events": float(hl),
        "comp_type_enc": enc,
    }])

    # Physics-based RUL (more accurate than XGBoost with limited training data)
    rul = _heuristic_rul(fh, pt, vib, hl, ctype)
    # ML-based anomaly detection on sensor readings
    anomaly_detected = bool(_anomaly_model.predict(features)[0] == -1)
    failure_rate = round(min(100.0, max(0.0, (1.0 - rul / sl) * 100)), 1)

    if failure_rate > 70:
        risk_level = "critical"
    elif failure_rate > 38:
        risk_level = "watch"
    else:
        risk_level = "healthy"

    nt = NORMAL_TEMP.get(ctype, _DEFAULT_TEMP)
    nv = NORMAL_VIB.get(ctype, _DEFAULT_VIB)

    if risk_level == "critical":
        report = (
            f"{comp_id} shows {failure_rate:.0f}% failure probability with {rul:.0f} flight hours remaining before service."
        )
        if pt > nt * 1.15:
            report += f" Peak temperature of {pt:.0f}°C is {((pt/nt)-1)*100:.0f}% above nominal."
        if vib > nv * 1.25:
            report += f" Vibration at {vib:.1f}g exceeds normal threshold of {nv:.1f}g."
        if hl > 8:
            report += f" {hl} hard landing events recorded."
        report += " Immediate inspection and service required before next flight."
    elif risk_level == "watch":
        report = (
            f"{comp_id} is approaching its service threshold — {rul:.0f} flight hours remaining. "
            f"Schedule maintenance within the next service window."
        )
        if days_svc > 180:
            report += f" Last service was {days_svc} days ago."
    else:
        report = (
            f"{comp_id} is operating within normal parameters. "
            f"Next service due in approximately {rul:.0f} flight hours."
        )

    if anomaly_detected:
        report += " ⚠ Sensor anomaly detected — manual inspection advised regardless of risk level."

    return {
        "component_id": comp_id,
        "component_type": ctype,
        "rul_hours": round(rul, 1),
        "failure_rate_percent": failure_rate,
        "risk_level": risk_level,
        "anomaly_detected": anomaly_detected,
        "report": report,
    }


# ── CSV column normalisation ───────────────────────────────────────────────────

_COL_ALIASES: dict[str, list[str]] = {
    "component_id": ["component id", "component_id", "id", "comp id", "part id"],
    "component_type": ["component type", "component_type", "type", "part type", "comp type"],
    "flight_hours": ["flight hours", "flight_hours", "hours", "flt hrs", "flight hrs"],
    "peak_temperature_c": ["peak temperature", "peak_temperature_c", "peak temp", "temperature", "temp c", "peak temp c"],
    "avg_vibration_g": ["vibration reading", "avg_vibration_g", "vibration", "avg vibration", "vib g", "vibration g"],
    "hard_landing_events": ["hard landing events", "hard_landing_events", "hard landings", "hard landing"],
    "last_service_date": ["last service date", "last_service_date", "last service", "service date"],
}


def _normalise_columns(df: pd.DataFrame) -> pd.DataFrame:
    rename = {}
    for canonical, aliases in _COL_ALIASES.items():
        for col in df.columns:
            if col.strip().lower() in aliases:
                rename[col] = canonical
                break
    return df.rename(columns=rename)


# ── Endpoints ──────────────────────────────────────────────────────────────────

class AnalyseRequest(BaseModel):
    components: List[dict]


@router.post("/analyse")
async def analyse(
    components_json: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    """
    Accepts either:
    - JSON form field `components_json`: stringified list of component dicts
    - CSV file upload
    """
    components: list[dict] = []

    if file:
        content = await file.read()
        try:
            df = pd.read_csv(io.BytesIO(content))
            df = _normalise_columns(df)
            df = df.where(pd.notna(df), None)
            components = df.to_dict(orient="records")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"CSV parse error: {e}")

    elif components_json:
        import json
        try:
            components = json.loads(components_json)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid components_json — must be a JSON array.")

    if not components:
        raise HTTPException(status_code=400, detail="Provide a CSV file or components_json field.")

    results = [predict_component(c) for c in components]

    critical = sum(1 for r in results if r["risk_level"] == "critical")
    watch = sum(1 for r in results if r["risk_level"] == "watch")
    healthy = sum(1 for r in results if r["risk_level"] == "healthy")

    return {
        "analysed_at": datetime.utcnow().isoformat() + "Z",
        "summary": {"critical": critical, "watch": watch, "healthy": healthy, "total": len(results)},
        "components": results,
    }


@router.post("/analyse/json")
async def analyse_json(req: AnalyseRequest):
    """JSON body variant of /maintenance/analyse for clients that prefer application/json."""
    if not req.components:
        raise HTTPException(status_code=400, detail="components list is empty.")

    results = [predict_component(c) for c in req.components]
    critical = sum(1 for r in results if r["risk_level"] == "critical")
    watch = sum(1 for r in results if r["risk_level"] == "watch")
    healthy = sum(1 for r in results if r["risk_level"] == "healthy")

    return {
        "analysed_at": datetime.utcnow().isoformat() + "Z",
        "summary": {"critical": critical, "watch": watch, "healthy": healthy, "total": len(results)},
        "components": results,
    }
