const fs = require('fs');

const path = 'apps/web/app/maintenance/mockAircraft.ts';
let code = fs.readFileSync(path, 'utf8');

const updatedTypes = `export type ComponentStatus = 'Healthy' | 'Watch' | 'Critical';
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
`;

const mockDataRegex = /export const mockAircraftList: Aircraft\[\] = (\[[\s\S]*?\]);\n\nlet currentAircraftList/m;
const match = code.match(mockDataRegex);

if (match) {
  let mockList = eval(match[1]); // Evaluate the array

  mockList.forEach(aircraft => {
    aircraft.components.forEach(comp => {
      // Assign mock type based on name
      const name = comp.name.toLowerCase();
      if (name.includes('engine') || name.includes('turbine') || name.includes('nozzle')) comp.type = 'Engine';
      else if (name.includes('gear') || name.includes('pump') || name.includes('actuator') || name.includes('valve')) comp.type = 'Hydraulics/Mechanics';
      else if (name.includes('avionics') || name.includes('sensor') || name.includes('radar') || name.includes('camera') || name.includes('pod')) comp.type = 'Avionics';
      else if (name.includes('battery') || name.includes('generator')) comp.type = 'Power';
      else comp.type = 'Airframe';

      if (comp.status === 'Critical') {
        comp.rul = Math.floor(Math.random() * 40) + 10;
        comp.actionTimeframe = 'Immediate';
        comp.diagnosticReport = "Critical fatigue detected in " + comp.name + ". Vibration analysis indicates severe misalignment. Immediate action required to prevent in-flight failure.";
        comp.recommendedAction = "Replace " + comp.name + " immediately.";
      } else if (comp.status === 'Watch') {
        comp.rul = Math.floor(Math.random() * 150) + 150;
        comp.actionTimeframe = Math.random() > 0.5 ? '30-day' : '60-day';
        comp.diagnosticReport = "Minor wear observed in " + comp.name + ". Performance is currently nominal, but degradation rate suggests preventative maintenance within the next cycle.";
        comp.recommendedAction = "Inspect and lubricate " + comp.name + " during next scheduled downtime.";
      } else {
        comp.rul = Math.floor(Math.random() * 5000) + 1000;
        comp.actionTimeframe = null;
        comp.diagnosticReport = "No issues detected. " + comp.name + " is operating within normal parameters.";
        comp.recommendedAction = "No action required.";
      }
    });
  });

  const newDataString = JSON.stringify(mockList, null, 2).replace(/"([^"]+)":/g, '$1:');
  
  const newCode = updatedTypes + '\n// TODO: This should come from a real fleet maintenance API later\nexport const mockAircraftList: Aircraft[] = ' + newDataString + ';\n';
  
  fs.writeFileSync(path, newCode, 'utf8');
  console.log('Successfully updated mockAircraft.ts');
} else {
  console.error('Could not find mockAircraftList');
}
