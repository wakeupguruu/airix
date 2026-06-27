export type ComponentStatus = 'Healthy' | 'Watch' | 'Critical';
export type ActionTimeframe = 'Immediate' | '30-day' | '60-day' | '90-day' | null;

export interface AircraftComponent {
  id: string;
  name: string;
  type: string;
  hoursUsed: number;
  status: ComponentStatus;
  rul: number;
  diagnosticReport: string;
  actionTimeframe: ActionTimeframe;
  recommendedAction: string;
}

export interface Aircraft {
  id: string;
  name: string;
  type: string; // Drone, Aircraft, Fighter Jet, Other
  totalFlightHours: number;
  criticalCount: number;
  watchCount: number;
  lastAnalysed: string;
  components: AircraftComponent[];
}

// TODO: This should come from a real fleet maintenance API later
export const mockAircraftList: Aircraft[] = [
  {
    id: "ac-1",
    name: "Ghost Hawk V-22",
    type: "Fighter Jet",
    totalFlightHours: 1240,
    criticalCount: 2,
    watchCount: 3,
    lastAnalysed: "Analysed 2 hours ago",
    components: [
      {
        id: "c-1",
        name: "Port Engine Turbine",
        hoursUsed: 1200,
        status: "Critical",
        type: "Engine",
        rul: 46,
        actionTimeframe: "Immediate",
        diagnosticReport: "Critical fatigue detected in Port Engine Turbine. Vibration analysis indicates severe misalignment. Immediate action required to prevent in-flight failure.",
        recommendedAction: "Replace Port Engine Turbine immediately."
      },
      {
        id: "c-2",
        name: "Starboard Landing Gear",
        hoursUsed: 1100,
        status: "Watch",
        type: "Hydraulics/Mechanics",
        rul: 266,
        actionTimeframe: "30-day",
        diagnosticReport: "Minor wear observed in Starboard Landing Gear. Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.",
        recommendedAction: "Inspect and lubricate Starboard Landing Gear during next scheduled downtime."
      },
      {
        id: "c-3",
        name: "Avionics Control Unit",
        hoursUsed: 1240,
        status: "Healthy",
        type: "Avionics",
        rul: 3203,
        actionTimeframe: null,
        diagnosticReport: "No issues detected. Avionics Control Unit is operating within normal parameters.",
        recommendedAction: "No action required."
      }
    ]
  },
  {
    id: "ac-2",
    name: "Phantom Recon Drone",
    type: "Drone",
    totalFlightHours: 850,
    criticalCount: 0,
    watchCount: 1,
    lastAnalysed: "Analysed 5 hours ago",
    components: [
      {
        id: "c-4",
        name: "Main Camera Gimbal",
        hoursUsed: 800,
        status: "Watch",
        type: "Avionics",
        rul: 211,
        actionTimeframe: "60-day",
        diagnosticReport: "Minor wear observed in Main Camera Gimbal. Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.",
        recommendedAction: "Inspect and lubricate Main Camera Gimbal during next scheduled downtime."
      }
    ]
  },
  {
    id: "ac-3",
    name: "C-130 Hercules Cargo",
    type: "Aircraft",
    totalFlightHours: 8500,
    criticalCount: 0,
    watchCount: 0,
    lastAnalysed: "Analysed 1 day ago",
    components: [
      {
        id: "c-5",
        name: "Hydraulic Pump A",
        hoursUsed: 4000,
        status: "Healthy",
        type: "Hydraulics/Mechanics",
        rul: 3796,
        actionTimeframe: null,
        diagnosticReport: "No issues detected. Hydraulic Pump A is operating within normal parameters.",
        recommendedAction: "No action required."
      }
    ]
  },
  {
    id: "ac-4",
    name: "Stingray Fighter Prototype",
    type: "Fighter Jet",
    totalFlightHours: 420,
    criticalCount: 1,
    watchCount: 0,
    lastAnalysed: "Analysed 30 mins ago",
    components: [
      {
        id: "c-6",
        name: "Exhaust Nozzle Flap",
        hoursUsed: 420,
        status: "Critical",
        type: "Engine",
        rul: 44,
        actionTimeframe: "Immediate",
        diagnosticReport: "Critical fatigue detected in Exhaust Nozzle Flap. Vibration analysis indicates severe misalignment. Immediate action required to prevent in-flight failure.",
        recommendedAction: "Replace Exhaust Nozzle Flap immediately."
      }
    ]
  },
  {
    id: "ac-5",
    name: "Surveyor X-1",
    type: "Drone",
    totalFlightHours: 120,
    criticalCount: 0,
    watchCount: 0,
    lastAnalysed: "Analysed 2 days ago",
    components: []
  },
  {
    id: "ac-6",
    name: "Boeing 737 Max Testbed",
    type: "Aircraft",
    totalFlightHours: 2400,
    criticalCount: 3,
    watchCount: 5,
    lastAnalysed: "Analysed just now",
    components: [
      {
        id: "c-7",
        name: "Aft Fuselage Sensor",
        hoursUsed: 2400,
        status: "Critical",
        type: "Avionics",
        rul: 42,
        actionTimeframe: "Immediate",
        diagnosticReport: "Critical fatigue detected in Aft Fuselage Sensor. Vibration analysis indicates severe misalignment. Immediate action required to prevent in-flight failure.",
        recommendedAction: "Replace Aft Fuselage Sensor immediately."
      },
      {
        id: "c-8",
        name: "Winglet Structural Joint",
        hoursUsed: 2400,
        status: "Watch",
        type: "Airframe",
        rul: 172,
        actionTimeframe: "60-day",
        diagnosticReport: "Minor wear observed in Winglet Structural Joint. Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.",
        recommendedAction: "Inspect and lubricate Winglet Structural Joint during next scheduled downtime."
      }
    ]
  },
  {
    id: "ac-7",
    name: "Valkyrie Heavy Bomber",
    type: "Fighter Jet",
    totalFlightHours: 4100,
    criticalCount: 0,
    watchCount: 2,
    lastAnalysed: "Analysed 12 hours ago",
    components: [
      {
        id: "c-9",
        name: "Bomb Bay Door Actuator",
        hoursUsed: 2100,
        status: "Watch",
        type: "Hydraulics/Mechanics",
        rul: 274,
        actionTimeframe: "60-day",
        diagnosticReport: "Minor wear observed in Bomb Bay Door Actuator. Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.",
        recommendedAction: "Inspect and lubricate Bomb Bay Door Actuator during next scheduled downtime."
      }
    ]
  },
  {
    id: "ac-8",
    name: "Delivery Drone Alpha",
    type: "Drone",
    totalFlightHours: 35,
    criticalCount: 0,
    watchCount: 0,
    lastAnalysed: "Analysed 1 week ago",
    components: []
  },
  {
    id: "ac-9",
    name: "A320 Neo Fleet Lead",
    type: "Aircraft",
    totalFlightHours: 6500,
    criticalCount: 1,
    watchCount: 1,
    lastAnalysed: "Analysed 3 days ago",
    components: [
      {
        id: "c-10",
        name: "APU Generator",
        hoursUsed: 3000,
        status: "Critical",
        type: "Power",
        rul: 14,
        actionTimeframe: "Immediate",
        diagnosticReport: "Critical fatigue detected in APU Generator. Vibration analysis indicates severe misalignment. Immediate action required to prevent in-flight failure.",
        recommendedAction: "Replace APU Generator immediately."
      }
    ]
  },
  {
    id: "ac-10",
    name: "Experimental Glider Y",
    type: "Other",
    totalFlightHours: 15,
    criticalCount: 0,
    watchCount: 0,
    lastAnalysed: "Analysed 1 month ago",
    components: []
  },
  {
    id: "ac-11",
    name: "Raptor F-22 Wing 1",
    type: "Fighter Jet",
    totalFlightHours: 3150,
    criticalCount: 0,
    watchCount: 4,
    lastAnalysed: "Analysed 4 hours ago",
    components: [
      {
        id: "c-11",
        name: "Radar Dome Sealing",
        hoursUsed: 3150,
        status: "Watch",
        type: "Avionics",
        rul: 236,
        actionTimeframe: "30-day",
        diagnosticReport: "Minor wear observed in Radar Dome Sealing. Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.",
        recommendedAction: "Inspect and lubricate Radar Dome Sealing during next scheduled downtime."
      }
    ]
  },
  {
    id: "ac-12",
    name: "Agriculture Spray Drone",
    type: "Drone",
    totalFlightHours: 450,
    criticalCount: 0,
    watchCount: 0,
    lastAnalysed: "Analysed 2 weeks ago",
    components: []
  },
  {
    id: "ac-13",
    name: "Private Jet Citation",
    type: "Aircraft",
    totalFlightHours: 1800,
    criticalCount: 0,
    watchCount: 1,
    lastAnalysed: "Analysed 6 hours ago",
    components: [
      {
        id: "c-12",
        name: "Cabin Pressurization Valve",
        hoursUsed: 1800,
        status: "Watch",
        type: "Hydraulics/Mechanics",
        rul: 225,
        actionTimeframe: "30-day",
        diagnosticReport: "Minor wear observed in Cabin Pressurization Valve. Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.",
        recommendedAction: "Inspect and lubricate Cabin Pressurization Valve during next scheduled downtime."
      }
    ]
  },
  {
    id: "ac-14",
    name: "Helicopter Apache",
    type: "Fighter Jet",
    totalFlightHours: 2200,
    criticalCount: 2,
    watchCount: 0,
    lastAnalysed: "Analysed 1 hour ago",
    components: [
      {
        id: "c-13",
        name: "Main Rotor Gearbox",
        hoursUsed: 2200,
        status: "Critical",
        type: "Hydraulics/Mechanics",
        rul: 16,
        actionTimeframe: "Immediate",
        diagnosticReport: "Critical fatigue detected in Main Rotor Gearbox. Vibration analysis indicates severe misalignment. Immediate action required to prevent in-flight failure.",
        recommendedAction: "Replace Main Rotor Gearbox immediately."
      }
    ]
  },
  {
    id: "ac-15",
    name: "High Altitude Balloon",
    type: "Other",
    totalFlightHours: 500,
    criticalCount: 0,
    watchCount: 0,
    lastAnalysed: "Analysed 5 days ago",
    components: []
  },
  {
    id: "ac-16",
    name: "Predator B Drone",
    type: "Drone",
    totalFlightHours: 1400,
    criticalCount: 1,
    watchCount: 2,
    lastAnalysed: "Analysed 10 hours ago",
    components: [
      {
        id: "c-14",
        name: "Targeting Pod Cooling",
        hoursUsed: 1400,
        status: "Critical",
        type: "Avionics",
        rul: 38,
        actionTimeframe: "Immediate",
        diagnosticReport: "Critical fatigue detected in Targeting Pod Cooling. Vibration analysis indicates severe misalignment. Immediate action required to prevent in-flight failure.",
        recommendedAction: "Replace Targeting Pod Cooling immediately."
      }
    ]
  },
  {
    id: "ac-17",
    name: "B-2 Spirit",
    type: "Fighter Jet",
    totalFlightHours: 5200,
    criticalCount: 0,
    watchCount: 0,
    lastAnalysed: "Analysed 12 days ago",
    components: []
  },
  {
    id: "ac-18",
    name: "Cessna 172 Trainer",
    type: "Aircraft",
    totalFlightHours: 9500,
    criticalCount: 0,
    watchCount: 4,
    lastAnalysed: "Analysed 8 hours ago",
    components: [
      {
        id: "c-15",
        name: "Engine Spark Plugs",
        hoursUsed: 500,
        status: "Watch",
        type: "Engine",
        rul: 168,
        actionTimeframe: "30-day",
        diagnosticReport: "Minor wear observed in Engine Spark Plugs. Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.",
        recommendedAction: "Inspect and lubricate Engine Spark Plugs during next scheduled downtime."
      }
    ]
  },
  {
    id: "ac-19",
    name: "Quad-Tiltrotor Test",
    type: "Other",
    totalFlightHours: 250,
    criticalCount: 4,
    watchCount: 1,
    lastAnalysed: "Analysed 5 mins ago",
    components: [
      {
        id: "c-16",
        name: "Sync Shaft Bearing",
        hoursUsed: 250,
        status: "Critical",
        type: "Airframe",
        rul: 47,
        actionTimeframe: "Immediate",
        diagnosticReport: "Critical fatigue detected in Sync Shaft Bearing. Vibration analysis indicates severe misalignment. Immediate action required to prevent in-flight failure.",
        recommendedAction: "Replace Sync Shaft Bearing immediately."
      }
    ]
  },
  {
    id: "ac-20",
    name: "Solar Powered UAV",
    type: "Drone",
    totalFlightHours: 10000,
    criticalCount: 0,
    watchCount: 1,
    lastAnalysed: "Analysed 1 day ago",
    components: [
      {
        id: "c-17",
        name: "Battery Cell Array B",
        hoursUsed: 10000,
        status: "Watch",
        type: "Power",
        rul: 281,
        actionTimeframe: "60-day",
        diagnosticReport: "Minor wear observed in Battery Cell Array B. Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.",
        recommendedAction: "Inspect and lubricate Battery Cell Array B during next scheduled downtime."
      }
    ]
  }
];
