import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SystemParams, SimulationDataPoint, DampingType } from './types';
import { simulateSystem } from './services/simulationService';
import ControlPanel from './components/ControlPanel';
import ResponseChart from './components/ResponseChart';
import SystemVisualization from './components/SystemVisualization';
import { GithubIcon } from './components/Icons';

const DURATION = 30; // Corresponds to simulation duration in service
const TIME_STEP = 0.02; // Corresponds to simulation dt in service

const App: React.FC = () => {
  const [params, setParams] = useState<SystemParams>({
    m: 10,  // mass in kg
    k: 40,  // spring constant in N/m
    c: 10,  // damping coefficient in Ns/m
  });

  const [simulationResult, setSimulationResult] = useState<{ data: SimulationDataPoint[]; dampingType: DampingType } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animationTime, setAnimationTime] = useState<number>(0);
  const animationFrameRef = useRef<number>();

  // Run simulation and reset animation when parameters change
  useEffect(() => {
    const result = simulateSystem(params);
    setSimulationResult(result);
    setAnimationTime(0);
    setIsPlaying(true);
  }, [params]);

  // Animation loop
  useEffect(() => {
    let lastTime: number | null = null;

    const animate = (timestamp: number) => {
      if (lastTime !== null) {
        const deltaTime = (timestamp - lastTime) / 1000;
        setAnimationTime(prevTime => {
          const newTime = prevTime + deltaTime;
          if (newTime >= DURATION) {
            setIsPlaying(false);
            return DURATION;
          }
          return newTime;
        });
      }
      lastTime = timestamp;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (animationTime >= DURATION) {
      setAnimationTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleRestart = () => {
    setAnimationTime(0);
    setIsPlaying(true);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setAnimationTime(parseFloat(e.target.value));
  };
  
  const findDisplacementAtTime = (time: number): number => {
    if (!simulationResult?.data?.length) return 0;
    const index = Math.min(
        simulationResult.data.length - 1,
        Math.floor(time / TIME_STEP)
    );
    return simulationResult.data[index]?.displacement ?? 0;
  };
  
  const currentDisplacement = findDisplacementAtTime(animationTime);

  const memoizedChart = useMemo(() => {
    return simulationResult ? <ResponseChart data={simulationResult.data} /> : null;
  }, [simulationResult]);

  return (
    <div className="min-h-screen bg-gray-950 font-sans">
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-cyan-400">
            Spring-Mass-Damper System Simulator
          </h1>
          <a href="https://github.com/react-llm/frame" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <GithubIcon className="w-6 h-6" />
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <ControlPanel 
            params={params} 
            setParams={setParams} 
            dampingType={simulationResult?.dampingType ?? DampingType.Underdamped}
          />
          {simulationResult && (
             <SystemVisualization
                displacement={currentDisplacement}
                time={animationTime}
                duration={DURATION}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onRestart={handleRestart}
                onTimeChange={handleTimeChange}
             />
          )}
        </div>
        <div className="lg:col-span-2 bg-gray-900/50 rounded-xl shadow-lg border border-gray-800 p-2 md:p-4 h-[300px] md:h-[400px] lg:h-auto">
          {memoizedChart}
        </div>
      </main>
    </div>
  );
};

export default App;
