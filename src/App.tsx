import React, { useState } from 'react';
import { LayoutGrid, ListTodo, Clock, Sun, Moon, LogOut, History } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import ActiveTaskWidget from './components/ActiveTaskWidget';
import CompletedTasks from './components/CompletedTasks';
import Timeline from './components/Timeline';
import EditTaskModal from './components/EditTaskModal';
import SessionSummary from './components/SessionSummary';
import { useTheme } from './context/ThemeContext';
import { generateRecurringInstances } from './utils/recurringTasks';
import { Task } from './types/task';
import { DailyHistory } from './types/history';
import HistoryView from './components/HistoryView';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';

function App() {
  const { user, loading, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<{ task: Task; startTime: Date } | null>(null);
  const [completedTasks, setCompletedTasks] = useState<(Task & { completedAt: Date; duration: number })[]>([]);
  const [view, setView] = useState<'grid' | 'timeline' | 'history'>('grid');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [taskHistory, setTaskHistory] = useState<DailyHistory[]>([]);
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleEndSession = () => {
    // Save current session to history
    const today = new Date().toISOString().split('T')[0];
    setTaskHistory(prev => [{
      date: today,
      tasks,
      completedTasks
    }, ...prev]);
    
    setShowSummary(true);
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'status'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      status: 'Pending',
    };
    setTasks(prev => [...prev, task]);
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    if (status === 'In Progress') {
      const task = tasks.find(t => t.id === id);
      if (task) {
        setActiveTask({ task, startTime: new Date() });
      }
    }
    setTasks(tasks.map((task) => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const handleTaskComplete = (duration: number) => {
    if (!activeTask) return;

    // For recurring tasks, only complete the current instance
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const taskDate = new Date(activeTask.task.date).setHours(0, 0, 0, 0);
    
    const completedTask = {
      ...activeTask.task,
      status: 'Completed' as const,
      completedAt: new Date(),
      duration
    };
    
    setCompletedTasks(prev => [completedTask, ...prev]);
    
    // For recurring tasks, only remove the current day's task
    setTasks(prev => prev.map(task => {
      if (task.id === activeTask.task.id) {
        if (task.recurrence) {
          // If it's a recurring task and we're completing today's instance
          if (new Date(task.date).setHours(0, 0, 0, 0) === currentDate) {
            return {
              ...task,
              status: 'Completed'
            };
          }
          // Keep future recurring instances
          return task;
        }
        // For non-recurring tasks, remove them
        return {
          ...task,
          status: 'Completed'
        };
      }
      return task;
    }).filter(task => {
      if (task.recurrence) {
        // Keep all recurring tasks
        return true;
      }
      // Remove completed non-recurring tasks
      return task.status !== 'Completed';
    }));
    
    setActiveTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    } transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {activeTask && (
          <div className="mb-8">
            <ActiveTaskWidget
              task={activeTask.task}
              startTime={activeTask.startTime}
              onComplete={handleTaskComplete}
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ListTodo size={32} className="text-orange-500" />
              <h1 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Daily Task Tracker</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                Sign Out
              </button>
              <button
                onClick={handleEndSession}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <LogOut size={20} />
                <span>End Session</span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-gray-800 dark:bg-gray-200 text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  view === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  view === 'timeline'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Clock size={20} />
              </button>
              <button
                onClick={() => setView('history')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  view === 'history'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <History size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CompletedTasks tasks={completedTasks} />
          <TaskForm onSubmit={handleAddTask} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div className="lg:col-span-2">
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    onEdit={() => setEditingTask(task)}
                  />
                ))}
              </div>
            ) : (
              view === 'timeline' ? (
                <Timeline tasks={tasks} />
              ) : (
                <HistoryView histories={taskHistory} />
              )
            )}
          </div>
        </div>
        
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={handleEditTask}
          />
        )}
        
        <SessionSummary
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          tasks={tasks}
          completedTasks={completedTasks}
        />
      </div>
    </div>
  );
}

export default App;