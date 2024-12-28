import { Task, WeekDay } from '../types/task';

export function generateRecurringInstances(task: Task): Task[] {
  if (!task.recurrence || !task.endDate) return [task];

  const instances: Task[] = [];
  const startDate = new Date(task.date);
  const endDate = new Date(task.endDate);
  
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const shouldAdd = shouldIncludeDate(currentDate, task.recurrence.pattern, task.recurrence.weekDays);
    
    if (shouldAdd) {
      instances.push({
        ...task,
        id: `${task.id}-${currentDate.toISOString()}`,
        date: new Date(currentDate),
        startTime: new Date(currentDate.setHours(
          task.startTime.getHours(),
          task.startTime.getMinutes()
        )),
        endTime: new Date(currentDate.setHours(
          task.endTime.getHours(),
          task.endTime.getMinutes()
        ))
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return instances;
}

function shouldIncludeDate(
  date: Date,
  pattern: Task['recurrence']['pattern'],
  weekDays?: WeekDay[]
): boolean {
  const day = date.getDay();
  
  switch (pattern) {
    case 'Daily':
      return true;
    case 'Weekdays':
      return day >= 1 && day <= 5;
    case 'Weekends':
      return day === 0 || day === 6;
    case 'Weekly':
      if (!weekDays?.length) return false;
      const dayNames: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return weekDays.includes(dayNames[day]);
    default:
      return false;
  }
}