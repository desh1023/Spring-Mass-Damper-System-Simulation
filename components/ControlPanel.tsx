
import React from 'react';
import { SystemParams, DampingType } from '../types';
import { InfoIcon } from './Icons';

interface SliderProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ label, unit, value, min, max, step, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="font-medium text-gray-300">{label}</label>
      <span className="px-2 py-1 bg-gray-700/50 text-cyan-400 text-sm rounded-md font-mono">
        {value.toFixed(1)} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
    />
  </div>
);

interface ControlPanelProps {
  params: SystemParams;
  setParams: (params: SystemParams) => void;
  dampingType: DampingType;
}

const DampingTypeBadge: React.FC<{ type: DampingType }> = ({ type }) => {
  const typeClasses = {
    [DampingType.Underdamped]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    [DampingType.CriticallyDamped]: 'bg-green-500/20 text-green-300 border-green-500/30',
    [DampingType.Overdamped]: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/80">
      <span className="font-medium text-gray-300">System State:</span>
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${typeClasses[type]}`}>
        {type}
      </span>
    </div>
  );
};

const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams, dampingType }) => {
  const handleParamChange = (param: keyof SystemParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [param]: parseFloat(e.target.value) });
  };

  return (
    <div className="bg-gray-900/50 rounded-xl shadow-lg border border-gray-800 p-6 space-y-6">
      <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-2">System Parameters</h2>
      
      <Slider
        label="Mass (m)"
        unit="kg"
        value={params.m}
        min={0.1}
        max={50}
        step={0.1}
        onChange={handleParamChange('m')}
      />
      <Slider
        label="Spring Constant (k)"
        unit="N/m"
        value={params.k}
        min={1}
        max={100}
        step={1}
        onChange={handleParamChange('k')}
      />
      <Slider
        label="Damping Coefficient (c)"
        unit="Ns/m"
        value={params.c}
        min={0}
        max={100}
        step={0.1}
        onChange={handleParamChange('c')}
      />
      
      <DampingTypeBadge type={dampingType} />
    </div>
  );
};

export default ControlPanel;
