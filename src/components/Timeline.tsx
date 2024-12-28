import React from 'react';
import { Task, Priority } from '../types/task';
import { AlertTriangle, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';

interface TimelineProps {
  tasks: Task[];
}

const getPriorityIcon = (priority: Priority) => {
  const iconClass = {
    High: 'text-red-500',
    Medium: 'text-yellow-500',
    Low: 'text-green-500'
  }[priority];
  return <AlertTriangle size={14} className={iconClass} />;
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

export default function Timeline({ tasks }: TimelineProps) {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const now = new Date();
  const isToday = isSameDay(selectedDate, now);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Timeline</h2>
        <div className="flex items-center space-x-4">
          {!isToday && (
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
            >
              Today
            </button>
          )}
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="text-orange-500" />
          </button>
          <span className="text-white font-medium">
            {formatDate(selectedDate)}
          </span>
          <button
            onClick={() => navigateDate(1)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronRight className="text-orange-500" />
          </button>
        </div>
      </div>
      <div className="relative h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Current time indicator */}
        <div
          className="absolute w-full h-0.5 bg-orange-500 z-10"
          style={{
            top: `${(currentHour * 60 + currentMinute) / (24 * 60) * 100}%`,
          }}
        />

        {/* Hours */}
        <div className="space-y-6">
          {hours.map((hour) => (
            <div key={hour} className="flex items-center">
              <span className="w-16 text-gray-400 text-sm">
                {hour.toString().padStart(2, '0')}:00
              </span>
              <div className="flex-1 h-12 border-l border-gray-700">
                {tasks
                  .filter((task) => {
                    // Handle recurring tasks
                    if (task.recurrence && task.endDate) {
                      const taskDate = new Date(task.date);
                      const endDate = new Date(task.endDate);
                      const currentDate = new Date(selectedDate);
                      currentDate.setHours(0, 0, 0, 0);
                      
                      // Check if selected date is within range
                      if (currentDate > endDate || currentDate < taskDate) {
                        return false;
                      }
                      
                      const dayOfWeek = currentDate.getDay();
                      const pattern = task.recurrence.pattern;
                      
                      let shouldShow = false;
                      switch (pattern) {
                        case 'Daily':
                          shouldShow = true;
                          break;
                        case 'Weekdays':
                          shouldShow = dayOfWeek >= 1 && dayOfWeek <= 5;
                          break;
                        case 'Weekends':
                          shouldShow = dayOfWeek === 0 || dayOfWeek === 6;
                          break;
                        case 'Weekly':
                          if (!task.recurrence.weekDays) return false;
                          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as WeekDay[];
                          shouldShow = task.recurrence.weekDays.includes(days[dayOfWeek]);
                          break;
                      }
                      
                      return shouldShow && task.startTime.getHours() === hour;
                    }
                    
                    // Non-recurring tasks
                    return isSameDay(task.date, selectedDate) && task.startTime.getHours() === hour;
                  })
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`ml-2 p-2 rounded text-sm flex items-center space-x-2 ${
                        task.status === 'Completed'
                          ? 'bg-green-500/20 text-green-400'
                          : task.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {getPriorityIcon(task.priority)}
                      <span>
                        {task.name}
                        {task.recurrence && (
                          <span className="ml-2 text-orange-500 text-xs flex items-center">
                            <Repeat size={12} className="mr-1" />
                            {task.recurrence.pattern}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}