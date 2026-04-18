import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import { type Task, type TaskStats, type Category, type Priority } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design Project Dashboard',
    description: 'Create high-fidelity wireframes for the new productivity app dashboard.',
    category: 'Work',
    priority: 'high',
    progress: 65,
    dueDate: new Date(Date.now() + 86400000 * 2),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'React Performance Audit',
    description: 'Optimize re-renders in the task list component using useMemo and memo.',
    category: 'Learning',
    priority: 'medium',
    progress: 30,
    dueDate: new Date(Date.now() + 86400000 * 4),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Daily Workout',
    description: '45 mins HIIT session at the gym.',
    category: 'Health',
    priority: 'medium',
    progress: 100,
    dueDate: new Date(),
    completed: true,
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Grocery Shopping',
    description: 'Buy vegetables, fruits, and snacks for the week.',
    category: 'Personal',
    priority: 'low',
    progress: 0,
    dueDate: new Date(Date.now() + 86400000),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '5',
    title: 'Finish Reading "Pragmatic Programmer"',
    description: 'Final chapters on career development and project management.',
    category: 'Learning',
    priority: 'low',
    progress: 85,
    dueDate: new Date(Date.now() + 86400000 * 7),
    completed: false,
    createdAt: new Date(),
  }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeView, setActiveView] = useState('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Personal' as Category,
    priority: 'medium' as Priority,
    dueDate: new Date().toISOString().split('T')[0]
  });

  const stats = useMemo((): TaskStats => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const averageProgress = total > 0 ? tasks.reduce((acc, t) => acc + t.progress, 0) / total : 0;
    
    const categories: Category[] = ['Personal', 'Work', 'Learning', 'Health', 'Other'];
    const distribution = categories.map(cat => ({
      name: cat,
      value: tasks.filter(t => t.category === cat).length
    })).filter(d => d.value > 0);

    return {
      total,
      completed,
      pending: total - completed,
      averageProgress,
      categoryDistribution: distribution
    };
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed, progress: !t.completed ? 100 : t.progress } : t
    ));
  };

  const updateProgress = (id: string, progress: number) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, progress, completed: progress === 100 } : t
    ));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      progress: 0,
      dueDate: new Date(newTask.dueDate),
      completed: false,
      createdAt: new Date()
    };
    setTasks(prev => [task, ...prev]);
    setIsModalOpen(false);
    setNewTask({ title: '', description: '', category: 'Personal', priority: 'medium', dueDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={setActiveView} 
      isDark={isDark} 
      toggleDark={() => setIsDark(!isDark)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="pb-20"
        >
          {activeView === 'dashboard' && <Dashboard stats={stats} />}
          {activeView === 'tasks' && (
            <TaskList 
              tasks={tasks} 
              onToggleComplete={toggleTask} 
              onUpdateProgress={updateProgress}
              onAddTask={() => setIsModalOpen(true)}
            />
          )}
          {activeView === 'calendar' && <CalendarView tasks={tasks} />}
          {['notifications', 'settings'].includes(activeView) && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400">
              <p className="text-xl font-bold mb-2 capitalize">{activeView} Module</p>
              <p>This section is coming soon in the next update!</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">New Task</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    required
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    placeholder="E.g., Complete UI Mockups"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={newTask.description}
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Add details about this task..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category</label>
                    <select
                      value={newTask.category}
                      onChange={e => setNewTask({...newTask, category: e.target.value as Category})}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Learning">Learning</option>
                      <option value="Health">Health</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
