import React from 'react';
import { PlayIcon, PauseIcon, RefreshIcon } from './Icons';

interface SystemVisualizationProps {
  displacement: number;
  time: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SVG_WIDTH = 250;
const SVG_HEIGHT = 250;
const CEILING_Y = 30;
const MASS_WIDTH = 100;
const MASS_HEIGHT = 50;
const MASS_EQUILIBRIUM_Y = 120;
const DISPLACEMENT_SCALE = 50;

const generateSpringPath = (startY: number, endY: number, width: number, coils: number): string => {
  const springHeight = endY - startY;
  if (springHeight <= 0) return `M ${SVG_WIDTH * 0.33},${startY} L ${SVG_WIDTH * 0.33},${endY}`;

  let path = `M ${SVG_WIDTH * 0.33},${startY} `;
  const segmentHeight = springHeight / coils;

  for (let i = 0; i < coils; i++) {
    path += `L ${SVG_WIDTH * 0.33 - width / 2} ${startY + segmentHeight * (i + 0.25)} `;
    path += `L ${SVG_WIDTH * 0.33 + width / 2} ${startY + segmentHeight * (i + 0.75)} `;
  }
  path += `L ${SVG_WIDTH * 0.33} ${endY}`;
  return path;
};

const SystemVisualization: React.FC<SystemVisualizationProps> = ({
  displacement,
  time,
  duration,
  isPlaying,
  onPlayPause,
  onRestart,
  onTimeChange
}) => {
  const massY = MASS_EQUILIBRIUM_Y + displacement * DISPLACEMENT_SCALE;
  const massX = (SVG_WIDTH - MASS_WIDTH) / 2;
  const springPath = generateSpringPath(CEILING_Y, massY, 25, 8);

  const damperX = SVG_WIDTH * 0.66;
  const damperRodTopY = CEILING_Y + 10;
  const damperCylinderBottomY = massY - 8;
  const damperCylinderTopY = CEILING_Y;

  return (
    <div className="bg-gray-900/50 rounded-xl shadow-lg border border-gray-800 p-4 space-y-4">
      <h3 className="text-lg font-bold text-white text-center">System Visualization</h3>
      <div className="bg-gray-850 rounded-lg aspect-square overflow-hidden flex justify-center items-center p-4">
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
          {/* Ceiling */}
          <line x1={SVG_WIDTH * 0.1} y1={CEILING_Y} x2={SVG_WIDTH * 0.9} y2={CEILING_Y} stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />

          {/* Damper */}
          <g stroke="#9ca3af">
            {/* Cylinder */}
            <line x1={damperX - 8} y1={damperCylinderBottomY} x2={damperX + 8} y2={damperCylinderBottomY} strokeWidth="2" strokeLinecap="round" />
            <line x1={damperX} y1={damperCylinderTopY} x2={damperX} y2={damperCylinderBottomY} strokeWidth="6" strokeLinecap="round" />
            {/* Rod */}
            <line x1={damperX} y1={massY} x2={damperX} y2={damperRodTopY} strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Spring */}
          <path d={springPath} stroke="#9ca3af" strokeWidth="2" fill="none" />

          {/* Mass */}
          <rect x={massX} y={massY} width={MASS_WIDTH} height={MASS_HEIGHT} fill="#67e8f9" rx="4" />
          <text x={SVG_WIDTH / 2} y={massY + MASS_HEIGHT / 2 + 5} textAnchor="middle" fill="#0b0f1a" fontSize="24" fontWeight="bold">m</text>
        </svg>
      </div>
       <div className="flex items-center gap-4">
          <button onClick={onPlayPause} className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-full text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500">
              {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
          <button onClick={onRestart} className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-full text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <RefreshIcon className="w-5 h-5" />
          </button>
          <input
              type="range"
              min={0}
              max={duration}
              step={0.02}
              value={time}
              onChange={onTimeChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
              aria-label="Animation progress"
          />
          <span className="text-sm font-mono text-gray-400 w-16 text-right">{time.toFixed(1)}s</span>
      </div>
    </div>
  );
};

export default SystemVisualization;
