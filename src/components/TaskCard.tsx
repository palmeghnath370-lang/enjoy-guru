import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MoreVertical, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { type Task } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  key?: string;
}

const PRIORITY_COLORS = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export default function TaskCard({ task, onToggleComplete, onUpdateProgress }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "glass-card p-5 rounded-2xl group transition-all duration-300 hover:shadow-lg",
        task.completed && "opacity-75 grayscale-[0.5]"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => onToggleComplete(task.id)}
            className="mt-1 transition-transform active:scale-90"
          >
            {task.completed ? (
              <CheckCircle2 className="text-blue-500 fill-blue-500/10" size={22} />
            ) : (
              <Circle className="text-zinc-300 dark:text-zinc-600" size={22} />
            )}
          </button>
          <div>
            <h4 className={cn(
              "font-semibold text-zinc-900 dark:text-zinc-100 leading-tight mb-1",
              task.completed && "line-through text-zinc-400"
            )}>
              {task.title}
            </h4>
            <div className="flex items-center gap-3 text-xs">
              <span className={cn("px-2 py-0.5 rounded-full font-medium", PRIORITY_COLORS[task.priority])}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <span className="text-zinc-400 dark:text-zinc-500">{task.category}</span>
            </div>
          </div>
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <MoreVertical size={18} />
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-zinc-500">Progress</span>
          <span className="font-mono">{task.progress}%</span>
        </div>
        <div className="relative h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${task.progress}%` }}
            className={cn(
              "absolute top-0 left-0 h-full rounded-full transition-colors",
              task.progress === 100 ? "bg-emerald-500" : "bg-blue-500"
            )}
          />
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
          <Calendar size={14} />
          <span className="text-xs">{format(task.dueDate, 'MMM d, yyyy')}</span>
        </div>
        {task.progress < 100 && !task.completed && (
          <div className="flex gap-1">
            {[25, 50, 75, 100].map((p) => (
              <button
                key={p}
                onClick={() => onUpdateProgress(task.id, p)}
                className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {p}%
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
