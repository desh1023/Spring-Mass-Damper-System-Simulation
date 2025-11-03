
import { SystemParams, SimulationDataPoint, DampingType } from '../types';

const getDampingType = (params: SystemParams): DampingType => {
  const { m, k, c } = params;
  if (m <= 0 || k < 0 || c < 0) return DampingType.Underdamped; // Default for invalid params

  const criticalDamping = 2 * Math.sqrt(k * m);
  
  if (Math.abs(c - criticalDamping) < 0.1) {
    return DampingType.CriticallyDamped;
  } else if (c > criticalDamping) {
    return DampingType.Overdamped;
  } else {
    return DampingType.Underdamped;
  }
};

export const simulateSystem = (params: SystemParams): { data: SimulationDataPoint[], dampingType: DampingType } => {
  const { m, k, c } = params;
  const data: SimulationDataPoint[] = [];

  // Simulation parameters
  const dt = 0.02; // time step
  const duration = 30; // total simulation time
  const numSteps = duration / dt;

  // Initial conditions
  let position = 1.0; // Initial displacement
  let velocity = 0.0; // Initial velocity

  for (let i = 0; i <= numSteps; i++) {
    const time = i * dt;
    data.push({ time, displacement: position });

    if (m > 0) {
      // Using Semi-implicit Euler method for better stability
      const acceleration = (-c * velocity - k * position) / m;
      velocity += acceleration * dt;
      position += velocity * dt;
    }
  }

  const dampingType = getDampingType(params);
  return { data, dampingType };
};
