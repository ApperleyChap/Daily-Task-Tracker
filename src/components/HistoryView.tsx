import React from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { DailyHistory } from '../types/history';

interface HistoryViewProps {
  histories: DailyHistory[];
}

export default function HistoryView({ histories }: HistoryViewProps) {
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {histories.map((history) => (
        <div key={history.date} className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex items-center mb-6">
            <Calendar className="text-orange-500 mr-2" size={24} />
            <h2 className="text-2xl font-bold text-white">{formatDate(history.date)}</h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-white">
                {history.tasks.length + history.completedTasks.length}
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-500">
                {history.completedTasks.length}
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Total Time</div>
              <div className="text-2xl font-bold text-orange-500">
                {formatDuration(history.completedTasks.reduce((acc, task) => acc + task.duration, 0))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[...history.completedTasks, ...history.tasks].map((task) => {
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
                      {isCompleted ? 'Completed' : 'Incomplete'}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="text-gray-400 text-sm mt-2">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2" />
                        Duration: {formatDuration((task as any).duration)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}