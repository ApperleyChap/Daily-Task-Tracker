import React from 'react';
import { X, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Task } from '../types/task';

interface CompletedTask extends Task {
  completedAt: Date;
  duration: number;
}

interface SessionSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  completedTasks: CompletedTask[];
}

export default function SessionSummary({ isOpen, onClose, tasks, completedTasks }: SessionSummaryProps) {
  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
      parts.push(`${remainingSeconds}s`);
    }

    return parts.join(' ');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const allTasks = [...tasks, ...completedTasks];
  const totalCompleted = completedTasks.length;
  const totalDuration = completedTasks.reduce((acc, task) => acc + task.duration, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Daily Session Summary</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-white">{allTasks.length}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-500">{totalCompleted}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400 mb-1">Total Time</div>
            <div className="text-2xl font-bold text-orange-500">{formatDuration(totalDuration)}</div>
          </div>
        </div>

        <div className="space-y-4">
          {allTasks.map((task) => {
            const isCompleted = 'completedAt' in task;
            
            return (
              <div
                key={task.id}
                className="bg-gray-700 rounded-lg p-4 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <AlertTriangle size={20} className="text-yellow-500" />
                    )}
                    <h3 className="text-lg font-semibold text-white">{task.name}</h3>
                  </div>
                  <span className={`text-sm ${isCompleted ? 'text-green-500' : 'text-yellow-500'}`}>
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="text-gray-400 text-sm space-y-1">
                  {isCompleted && (
                    <>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2" />
                        <span>Duration: {formatDuration((task as CompletedTask).duration)}</span>
                      </div>
                      <div>Started: {formatTime(task.startTime)}</div>
                      <div>Finished: {formatTime((task as CompletedTask).completedAt)}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}