export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Work' | 'Personal';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type RecurrencePattern = 'None' | 'Daily' | 'Weekly' | 'Weekdays' | 'Weekends';
export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Task {
  id: string;
  name: string;
  date: Date;
  endDate?: Date;  // Optional end date for recurring tasks
  startTime: Date;
  endTime: Date;
  priority: Priority;
  description?: string;
  category: Category;
  status: TaskStatus;
  recurrence?: {
    pattern: RecurrencePattern;
    weekDays?: WeekDay[];
  };
}

export interface TimeSlot {
  hour: number;
  minute: number;
}