import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Task } from '../types/task';

interface CompletedTask extends Task {
  completedAt: Date;
  duration: number;
}

interface CompletedTasksProps {
  tasks: CompletedTask[];
}

export default function CompletedTasks({ tasks }: CompletedTasksProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
      parts.push(`${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
    }

    return parts.join(', ');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex items-center mb-6">
        <CheckCircle className="text-green-500 mr-2" size={24} />
        <h2 className="text-2xl font-bold text-white">Today's Completed Tasks</h2>
      </div>
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:bg-gray-600"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">{task.name}</h3>
              <span className="text-green-500 text-sm">Completed</span>
            </div>
            <div className="text-gray-400 text-sm space-y-1">
              <div className="flex items-center">
                <Clock size={14} className="mr-2" />
                <span>Duration: {formatDuration(task.duration)}</span>
              </div>
              <div>
                Started: {task.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div>
                Finished: {task.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}