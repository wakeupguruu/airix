export type Category = 
  | 'Fuselage'
  | 'Wings'
  | 'Engines'
  | 'Control Surfaces'
  | 'Landing Gear'
  | 'Avionics';

export interface ComponentItem {
  id: string;
  name: string;
  category: Category;
  mass: string;
  material: string;
}

// TODO: Replace with real component API data when available
export const mockComponents: ComponentItem[] = [
  // Fuselage
  { id: 'c-1', name: 'Standard Fuselage Section A', category: 'Fuselage', mass: '18.2 kg', material: 'Aluminum 7075' },
  { id: 'c-2', name: 'Lightweight Composite Fuselage', category: 'Fuselage', mass: '9.6 kg', material: 'Carbon Fiber Composite' },
  { id: 'c-3', name: 'Extended Tail Cone', category: 'Fuselage', mass: '12.4 kg', material: 'Aluminum 2024' },
  { id: 'c-4', name: 'Forward Radome Section', category: 'Fuselage', mass: '4.8 kg', material: 'Fiberglass' },
  
  // Wings
  { id: 'c-5', name: 'Swept Wing Panel', category: 'Wings', mass: '14.1 kg', material: 'Carbon Fiber Composite' },
  { id: 'c-6', name: 'Winglet Assembly', category: 'Wings', mass: '3.2 kg', material: 'Aluminum 6061' },
  { id: 'c-7', name: 'Straight Trainer Wing', category: 'Wings', mass: '16.5 kg', material: 'Aluminum 2024' },
  { id: 'c-8', name: 'High-Lift Flap System', category: 'Wings', mass: '8.4 kg', material: 'Composite' },
  { id: 'c-9', name: 'Delta Wing Core', category: 'Wings', mass: '22.0 kg', material: 'Titanium Honeycomb' },
  
  // Engines
  { id: 'c-10', name: 'Turbofan Engine Mount', category: 'Engines', mass: '42.0 kg', material: 'Titanium Alloy' },
  { id: 'c-11', name: 'Electric Propulsion Unit', category: 'Engines', mass: '28.5 kg', material: 'Aluminum 7075' },
  { id: 'c-12', name: 'Microjet Engine Housing', category: 'Engines', mass: '15.2 kg', material: 'High-Temp Alloy' },
  { id: 'c-13', name: 'Propeller Hub Assembly', category: 'Engines', mass: '6.7 kg', material: 'Steel Alloy' },
  
  // Control Surfaces
  { id: 'c-14', name: 'Aileron Assembly', category: 'Control Surfaces', mass: '5.4 kg', material: 'Carbon Fiber Composite' },
  { id: 'c-15', name: 'Rudder Unit', category: 'Control Surfaces', mass: '6.1 kg', material: 'Aluminum 6061' },
  { id: 'c-16', name: 'Horizontal Stabilizer', category: 'Control Surfaces', mass: '11.3 kg', material: 'Aluminum 2024' },
  { id: 'c-17', name: 'Elevator Control Surface', category: 'Control Surfaces', mass: '4.9 kg', material: 'Composite' },
  
  // Landing Gear
  { id: 'c-18', name: 'Tricycle Landing Gear', category: 'Landing Gear', mass: '31.7 kg', material: 'Titanium Alloy' },
  { id: 'c-19', name: 'Retractable Nose Gear', category: 'Landing Gear', mass: '19.3 kg', material: 'Steel Alloy' },
  { id: 'c-20', name: 'Main Gear Strut', category: 'Landing Gear', mass: '24.5 kg', material: 'High-Strength Steel' },
  { id: 'c-21', name: 'Light Aircraft Fixed Gear', category: 'Landing Gear', mass: '12.0 kg', material: 'Aluminum 7075' },
  
  // Avionics
  { id: 'c-22', name: 'Flight Control Computer', category: 'Avionics', mass: '2.1 kg', material: 'Composite Housing' },
  { id: 'c-23', name: 'Navigation Module', category: 'Avionics', mass: '1.4 kg', material: 'Composite Housing' },
  { id: 'c-24', name: 'Weather Radar Dome', category: 'Avionics', mass: '3.6 kg', material: 'Polymer' },
  { id: 'c-25', name: 'Telemetry Transceiver', category: 'Avionics', mass: '0.8 kg', material: 'Aluminum Casing' }
];
