import React from 'react';
import { Clock, Tag, AlertTriangle, CheckCircle, Play, Trash2, Pause, Edit2, Repeat } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'In Progress': return 'bg-blue-500/10 text-blue-500';
      case 'Completed': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{task.name}</h3>
        <div className="flex items-center space-x-2">
          {task.recurrence && (
            <Repeat size={16} className="text-orange-500" />
          )}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-400">
          <Clock size={16} className="mr-2" />
          <span className="flex items-center text-sm">
            {task.date.toLocaleDateString()} • 
            {task.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {task.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {task.recurrence && (
              <span className="ml-2 flex items-center text-orange-500 text-xs">
                <Repeat size={14} className="mr-1" />
                {task.recurrence.pattern}
                {task.endDate && (
                  <span className="ml-1 text-gray-400 whitespace-nowrap">
                    until {task.endDate.toLocaleDateString()}
                  </span>
                )}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center text-gray-400 text-sm">
          <Tag size={16} className="mr-2" />
          <span>{task.category}</span>
        </div>

        <div className="flex items-center text-sm">
          <AlertTriangle size={16} className={`mr-2 ${getPriorityColor(task.priority)}`} />
          <span className={getPriorityColor(task.priority)}>{task.priority} Priority</span>
        </div>

        {task.description && (
          <p className="text-gray-400 text-sm mt-2">{task.description}</p>
        )}

        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
          {task.status === 'Pending' && (
            <button
              onClick={() => onStatusChange(task.id, 'In Progress')}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
            >
              <Play size={16} className="mr-2" />
              Start
            </button>
          )}
          
          {task.status === 'In Progress' && (
            <button
              onClick={() => onStatusChange(task.id, 'Pending')}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-md hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center"
            >
              <Pause size={16} className="mr-2" />
              Pause
            </button>
          )}
          
          {task.status === 'In Progress' && (
            <button
              onClick={() => onStatusChange(task.id, 'Completed')}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center"
            >
              <CheckCircle size={16} className="mr-2" />
              Complete
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}