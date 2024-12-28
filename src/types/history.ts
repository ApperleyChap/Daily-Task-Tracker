import { Task } from './task';

export interface DailyHistory {
  date: string;
  tasks: Task[];
  completedTasks: (Task & { completedAt: Date; duration: number })[];
}

export interface TaskHistory {
  histories: DailyHistory[];
}