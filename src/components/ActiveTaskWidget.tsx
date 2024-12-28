import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Task } from '../types/task';

interface ActiveTaskWidgetProps {
  task: Task;
  startTime: Date;
  onComplete: (duration: number) => void;
}

export default function ActiveTaskWidget({ task, startTime, onComplete }: ActiveTaskWidgetProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
  };

  return (
    <div className="bg-orange-500 p-4 rounded-lg shadow-xl w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{task.name}</h3>
        <Clock className="text-white" size={20} />
      </div>
      <div className="text-2xl font-mono text-white mb-3">
        {formatTime(elapsedTime)}
      </div>
      <button
        onClick={() => onComplete(elapsedTime)}
        className="w-full bg-white text-orange-500 py-2 px-4 rounded-md hover:bg-gray-100 transition-all duration-300 flex items-center justify-center font-semibold"
      >
        <CheckCircle size={16} className="mr-2" />
        Complete Task
      </button>
    </div>
  );
}