import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Filter, SortDesc } from 'lucide-react';
import { type Task, type Category, type Priority } from '../types';
import TaskCard from './TaskCard';
import { cn } from '../lib/utils';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onAddTask: () => void;
}

export default function TaskList({ tasks, onToggleComplete, onUpdateProgress, onAddTask }: TaskListProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const categories: (Category | 'All')[] = ['All', 'Personal', 'Work', 'Learning', 'Health', 'Other'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
        <button 
          onClick={onAddTask}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span className="font-semibold">Add New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="text-zinc-400" size={18} />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <SortDesc className="text-zinc-400" size={18} />
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
          >
            <option value="All">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredTasks.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleComplete={onToggleComplete}
                onUpdateProgress={onUpdateProgress}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-zinc-400"
          >
            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-full mb-4">
              <Search size={40} />
            </div>
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Try adjusting your filters or add a new task</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
