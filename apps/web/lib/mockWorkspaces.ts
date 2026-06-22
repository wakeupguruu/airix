import { Workspace } from '../app/types';

// TODO: Replace with real workspaces API later
const baseWorkspaces: Workspace[] = [
  { id: 'ws-1', name: 'AeroFoil AX-100 Wing', mode: 'Concept Studio', status: 'Active', lastEdited: 'Edited 2 hours ago' },
  { id: 'ws-2', name: 'V-Tail UAV Mesh Profile', mode: 'Blank Workspace', status: 'Completed', lastEdited: 'Edited 1 day ago' },
  { id: 'ws-3', name: 'Biplane Struct V2 Refinement', mode: 'Text → 3D', status: 'Analyzing', lastEdited: 'Edited 3 days ago' },
  { id: 'ws-4', name: 'Glider Fuselage Photogrammetry', mode: 'Image → 3D', status: 'Draft', lastEdited: 'Edited 1 week ago' },
  { id: 'ws-5', name: 'Supersonic Jet Intake', mode: 'Concept Studio', status: 'Active', lastEdited: 'Edited 2 days ago' },
  { id: 'ws-6', name: 'Turbofan Engine Nacelle', mode: 'Blank Workspace', status: 'Draft', lastEdited: 'Edited 5 days ago' },
  { id: 'ws-7', name: 'Quadcopter Frame V1', mode: 'Text → 3D', status: 'Completed', lastEdited: 'Edited 2 weeks ago' },
  { id: 'ws-8', name: 'Winglet Edge Analysis', mode: 'Image → 3D', status: 'Analyzing', lastEdited: 'Edited 1 hour ago' },
  { id: 'ws-9', name: 'Helicopter Rotor Blade', mode: 'Concept Studio', status: 'Draft', lastEdited: 'Edited 4 hours ago' },
  { id: 'ws-10', name: 'Landing Gear Strut', mode: 'Blank Workspace', status: 'Active', lastEdited: 'Edited 6 hours ago' },
  { id: 'ws-11', name: 'Cockpit Canopy Profile', mode: 'Text → 3D', status: 'Completed', lastEdited: 'Edited 3 weeks ago' },
  { id: 'ws-12', name: 'Drone Payload Pod', mode: 'Image → 3D', status: 'Analyzing', lastEdited: 'Edited 2 days ago' },
  { id: 'ws-13', name: 'Delta Wing Core Structure', mode: 'Concept Studio', status: 'Active', lastEdited: 'Edited 5 hours ago' },
  { id: 'ws-14', name: 'Vertical Stabilizer Base', mode: 'Blank Workspace', status: 'Draft', lastEdited: 'Edited 12 hours ago' },
  { id: 'ws-15', name: 'Experimental Airfoil X', mode: 'Text → 3D', status: 'Active', lastEdited: 'Edited 1 day ago' },
  { id: 'ws-16', name: 'Nose Cone Aerodynamics', mode: 'Image → 3D', status: 'Completed', lastEdited: 'Edited 1 month ago' },
  { id: 'ws-17', name: 'Jet Engine Exhaust Nozzle', mode: 'Concept Studio', status: 'Analyzing', lastEdited: 'Edited 2 days ago' },
  { id: 'ws-18', name: 'Flight Control Surface', mode: 'Blank Workspace', status: 'Active', lastEdited: 'Edited 3 days ago' },
  { id: 'ws-19', name: 'Cargo Bay Door Mechanism', mode: 'Text → 3D', status: 'Draft', lastEdited: 'Edited 1 week ago' },
  { id: 'ws-20', name: 'Radar Dome Housing', mode: 'Image → 3D', status: 'Completed', lastEdited: 'Edited 2 months ago' },
  { id: 'ws-21', name: 'Propeller Pitch Mechanism', mode: 'Concept Studio', status: 'Active', lastEdited: 'Edited 8 hours ago' },
  { id: 'ws-22', name: 'Seaplane Pontoon Mesh', mode: 'Blank Workspace', status: 'Analyzing', lastEdited: 'Edited 4 days ago' },
  { id: 'ws-23', name: 'Light Sport Aircraft Wing', mode: 'Text → 3D', status: 'Draft', lastEdited: 'Edited 2 weeks ago' },
  { id: 'ws-24', name: 'Avionics Dashboard Layout', mode: 'Image → 3D', status: 'Completed', lastEdited: 'Edited 3 months ago' },
  { id: 'ws-25', name: 'Tailhook Arresting Gear', mode: 'Concept Studio', status: 'Active', lastEdited: 'Edited 1 day ago' }
];

const extraWorkspaces: Workspace[] = Array.from({ length: 55 }, (_, i) => ({
  id: `ws-${26 + i}`,
  name: `Aerodynamic Test Data ${i + 1}`,
  mode: i % 4 === 0 ? 'Image → 3D' : i % 3 === 0 ? 'Concept Studio' : i % 2 === 0 ? 'Text → 3D' : 'Blank Workspace',
  status: i % 5 === 0 ? 'Draft' : i % 4 === 0 ? 'Analyzing' : i % 3 === 0 ? 'Active' : 'Completed',
  lastEdited: `Edited ${i + 2} days ago`
}));

export let mockWorkspaces: Workspace[] = [...baseWorkspaces, ...extraWorkspaces];

export const updateMockWorkspaces = (newWorkspaces: Workspace[]) => {
  mockWorkspaces = newWorkspaces;
};
