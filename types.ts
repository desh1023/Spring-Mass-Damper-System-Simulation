
export interface SystemParams {
  m: number; // mass
  k: number; // spring constant
  c: number; // damping coefficient
}

export interface SimulationDataPoint {
  time: number;
  displacement: number;
}

export enum DampingType {
  Underdamped = 'Underdamped',
  CriticallyDamped = 'Critically Damped',
  Overdamped = 'Overdamped',
}
