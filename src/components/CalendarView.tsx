import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { cn } from '../lib/utils';
import { type Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-bold min-w-[150px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dayTasks = tasks.filter(t => isSameDay(t.dueDate, day));
            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[120px] p-2 border-r border-b border-zinc-100 dark:border-zinc-800 last:border-r-0 relative",
                  !isSameMonth(day, monthStart) && "bg-zinc-50/50 dark:bg-zinc-900/20"
                )}
              >
                <span className={cn(
                  "inline-flex items-center justify-center w-7 h-7 text-sm font-semibold rounded-full mb-1",
                  isToday(day) ? "bg-blue-600 text-white" : "text-zinc-500"
                )}>
                  {format(day, 'd')}
                </span>
                
                <div className="space-y-1">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 truncate font-medium",
                        task.completed && "opacity-50 grayscale"
                      )}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
