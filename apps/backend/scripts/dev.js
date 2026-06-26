// Cross-platform dev runner for the Go backend.
// Constructs a correct absolute GOCACHE path per OS before launching air.
// This is needed because Turbo's process isolation can strip or corrupt GOCACHE,
// and some machines have `GOCACHE=off` set in their Go user env file.

const { spawn } = require("child_process");
const os = require("os");
const path = require("path");

function resolveGoCache() {
  switch (process.platform) {
    case "win32": {
      const localAppData =
        process.env.LOCALAPPDATA ||
        path.join(os.homedir(), "AppData", "Local");
      return path.join(localAppData, "go-build");
    }
    case "darwin": {
      return path.join(os.homedir(), "Library", "Caches", "go-build");
    }
    default: {
      // Linux / Ubuntu:
      const xdgCache =
        process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");
      return path.join(xdgCache, "go", "build");
    }
  }
}

const goCache = resolveGoCache();
console.log(`[backend] GOCACHE → ${goCache}`);

const child = spawn("air", [], {
  env: { ...process.env, GOCACHE: goCache },
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 0));
