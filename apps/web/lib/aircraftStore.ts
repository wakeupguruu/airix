import { Aircraft, mockAircraftList } from '../app/maintenance/mockAircraft';

const STORE_KEY = 'airix_aircraft_session';

// TODO: Replace with real API
export const getAllAircraft = (): Aircraft[] => {
  if (typeof window === 'undefined') return mockAircraftList;
  
  const stored = sessionStorage.getItem(STORE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse aircraft from sessionStorage', e);
    }
  }
  
  // Initialize if empty
  sessionStorage.setItem(STORE_KEY, JSON.stringify(mockAircraftList));
  return mockAircraftList;
};

export const getAircraftById = (id: string): Aircraft | undefined => {
  const all = getAllAircraft();
  return all.find(a => a.id === id);
};

export const addAircraft = (aircraft: Aircraft): void => {
  if (typeof window === 'undefined') return;
  
  const all = getAllAircraft();
  const updated = [aircraft, ...all];
  sessionStorage.setItem(STORE_KEY, JSON.stringify(updated));
};

export const updateAircraft = (id: string, updates: Partial<Aircraft>): void => {
  if (typeof window === 'undefined') return;
  
  const all = getAllAircraft();
  const updated = all.map(a => a.id === id ? { ...a, ...updates } : a);
  sessionStorage.setItem(STORE_KEY, JSON.stringify(updated));
};
