
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SimulationDataPoint } from '../types';

interface ResponseChartProps {
  data: SimulationDataPoint[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-850/80 backdrop-blur-sm p-3 border border-gray-700 rounded-lg shadow-lg">
        <p className="label text-gray-400">{`Time : ${label.toFixed(2)} s`}</p>
        <p className="intro text-cyan-400 font-bold">{`Displacement : ${payload[0].value.toFixed(3)} m`}</p>
      </div>
    );
  }
  return null;
};

const ResponseChart: React.FC<ResponseChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="time" 
          stroke="#9ca3af" 
          tick={{ fill: '#9ca3af', fontSize: 12 }} 
          label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: '#d1d5db' }}
          domain={['dataMin', 'dataMax']}
          type="number"
        />
        <YAxis 
          stroke="#9ca3af" 
          tick={{ fill: '#9ca3af', fontSize: 12 }} 
          label={{ value: 'Displacement (m)', angle: -90, position: 'insideLeft', fill: '#d1d5db', dx: -5 }}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#d1d5db', bottom: 0 }} />
        <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 4" />
        <Line 
          type="monotone" 
          dataKey="displacement" 
          stroke="#22d3ee" 
          strokeWidth={2} 
          dot={false} 
          name="Displacement"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ResponseChart;
