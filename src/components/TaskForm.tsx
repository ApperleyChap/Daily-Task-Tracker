import React, { useState } from 'react';
import { Plus, Repeat } from 'lucide-react';
import { Task, Priority, Category, TimeSlot, RecurrencePattern, WeekDay } from '../types/task';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'status'>) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<TimeSlot>({ hour: 9, minute: 0 });
  const [endTime, setEndTime] = useState<TimeSlot>({ hour: 9, minute: 30 });
  const [priority, setPriority] = useState<Priority>('Medium');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>('None');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedWeekDays, setSelectedWeekDays] = useState<WeekDay[]>([]);

  const weekDays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length > 50) return;
    if (description.length > 200) return;
    
    const taskDate = new Date(date);

    const start = new Date();
    start.setFullYear(parseInt(date.split('-')[0]), parseInt(date.split('-')[1]) - 1, parseInt(date.split('-')[2]));
    start.setHours(startTime.hour, startTime.minute);
    const end = new Date();
    end.setFullYear(parseInt(date.split('-')[0]), parseInt(date.split('-')[1]) - 1, parseInt(date.split('-')[2]));
    end.setHours(endTime.hour, endTime.minute);

    onSubmit({
      name,
      date: new Date(date),
      endDate: recurrencePattern !== 'None' ? new Date(endDate) : undefined,
      startTime: start,
      endTime: end,
      priority,
      description,
      category,
      recurrence: recurrencePattern !== 'None' ? {
        pattern: recurrencePattern,
        weekDays: recurrencePattern === 'Weekly' 
          ? selectedWeekDays 
          : undefined
      } : undefined
    });

    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Add New Task</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-orange-400 mb-2">Task Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-orange-400 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-orange-400 mb-2">Start Time</label>
            <div className="flex space-x-2">
              <select
                value={startTime.hour}
                onChange={(e) => setStartTime({ ...startTime, hour: parseInt(e.target.value) })}
                className="flex-1 bg-gray-700 text-white px-2 py-2 rounded-md"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <select
                value={startTime.minute}
                onChange={(e) => setStartTime({ ...startTime, minute: parseInt(e.target.value) })}
                className="flex-1 bg-gray-700 text-white px-2 py-2 rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                  <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-orange-400 mb-2">End Time</label>
            <div className="flex space-x-2">
              <select
                value={endTime.hour}
                onChange={(e) => {
                  const newHour = parseInt(e.target.value);
                  if (newHour < startTime.hour) {
                    setEndTime({ hour: startTime.hour, minute: Math.max(endTime.minute, startTime.minute) });
                  } else {
                    setEndTime({ ...endTime, hour: newHour });
                  }
                }}
                className="flex-1 bg-gray-700 text-white px-2 py-2 rounded-md"
              >
                {Array.from({ length: 24 - startTime.hour }, (_, i) => i + startTime.hour).map(i => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <select
                value={endTime.minute}
                onChange={(e) => {
                  const newMinute = parseInt(e.target.value);
                  if (endTime.hour === startTime.hour && newMinute <= startTime.minute) {
                    setEndTime({ ...endTime, minute: startTime.minute + 5 });
                  } else {
                    setEndTime({ ...endTime, minute: newMinute });
                  }
                }}
                className="flex-1 bg-gray-700 text-white px-2 py-2 rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                  <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-orange-400 mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-orange-400 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div>
          <label className="block text-orange-400 mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md h-24 resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-orange-400 mb-2">Recurrence</label>
          <select
            value={recurrencePattern}
            onChange={(e) => setRecurrencePattern(e.target.value as RecurrencePattern)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            <option value="None">No Recurrence</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
          </select>
        </div>

        {recurrencePattern !== 'None' && (
          <div>
            <label className="block text-orange-400 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={date}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
        )}

        {recurrencePattern === 'Weekly' && (
          <div>
            <label className="block text-orange-400 mb-2">Select Days</label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    setSelectedWeekDays(prev =>
                      prev.includes(day)
                        ? prev.filter(d => d !== day)
                        : [...prev, day]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedWeekDays.includes(day)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Task</span>
          {recurrencePattern !== 'None' && <Repeat size={16} className="ml-2" />}
        </button>
      </div>
    </form>
  );
}