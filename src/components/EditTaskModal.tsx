import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, Priority, Category, TimeSlot, RecurrencePattern, WeekDay } from '../types/task';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const weekDays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [startTime, setStartTime] = useState({ hour: task.startTime.getHours(), minute: 0 });
  const [endTime, setEndTime] = useState({ hour: task.endTime.getHours(), minute: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = new Date(editedTask.date);
    start.setHours(startTime.hour, startTime.minute);
    const end = new Date(editedTask.date);
    end.setHours(endTime.hour, endTime.minute);
    
    const updatedTask = {
      ...editedTask,
      startTime: start,
      endTime: end
    };
    
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 dark:bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white dark:text-gray-900">Edit Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-orange-400 dark:text-orange-600 mb-2">Task Name</label>
            <input
              type="text"
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
              maxLength={50}
              className="w-full bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-orange-400 dark:text-orange-600 mb-2">Date</label>
            <input
              type="date"
              value={editedTask.date.toISOString().split('T')[0]}
              onChange={(e) => setEditedTask({ ...editedTask, date: new Date(e.target.value) })}
              className="w-full bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-orange-400 dark:text-orange-600 mb-2">Start Time</label>
              <div className="flex space-x-2">
                <select
                  value={startTime.hour}
                  onChange={(e) => setStartTime({ ...startTime, hour: parseInt(e.target.value) })}
                  className="flex-1 bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-2 rounded-md"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <select
                  value={startTime.minute}
                  onChange={(e) => setStartTime({ ...startTime, minute: parseInt(e.target.value) })}
                  className="flex-1 bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-2 rounded-md"
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                    <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-orange-400 dark:text-orange-600 mb-2">End Time</label>
              <div className="flex space-x-2">
                <select
                  value={endTime.hour}
                  onChange={(e) => setEndTime({ ...endTime, hour: parseInt(e.target.value) })}
                  className="flex-1 bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-2 rounded-md"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <select
                  value={endTime.minute}
                  onChange={(e) => setEndTime({ ...endTime, minute: parseInt(e.target.value) })}
                  className="flex-1 bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-2 rounded-md"
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                    <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-orange-400 dark:text-orange-600 mb-2">Priority</label>
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Priority })}
              className="w-full bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-orange-400 dark:text-orange-600 mb-2">Category</label>
            <select
              value={editedTask.category}
              onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value as Category })}
              className="w-full bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div>
            <label className="block text-orange-400 dark:text-orange-600 mb-2">Description</label>
            <textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              maxLength={200}
              className="w-full bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md h-24 resize-none"
            />
          </div>

          {editedTask.recurrence && (
            <div>
              <label className="block text-orange-400 dark:text-orange-600 mb-2">End Date</label>
              <input
                type="date"
                value={editedTask.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setEditedTask({ ...editedTask, endDate: new Date(e.target.value) })}
                min={editedTask.date.toISOString().split('T')[0]}
                className="w-full bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}