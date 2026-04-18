import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, ListTodo, Calendar, Settings, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
          : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400"
      )}
    >
      <Icon size={20} className={cn(active ? "text-white" : "group-hover:text-blue-500")} />
      <span className="font-semibold">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-nav"
          className="absolute inset-0 bg-blue-600 rounded-xl -z-10"
        />
      )}
    </button>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  isDark: boolean;
  toggleDark: () => void;
}

export default function Layout({ children, activeView, onViewChange, isDark, toggleDark }: LayoutProps) {
  return (
    <div className={cn("min-h-screen flex", isDark ? "dark" : "")}>
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 p-6 hidden lg:flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            T
          </div>
          <span className="text-xl font-bold tracking-tight">TaskSync</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => onViewChange('dashboard')} 
          />
          <SidebarItem 
            icon={ListTodo} 
            label="My Tasks" 
            active={activeView === 'tasks'} 
            onClick={() => onViewChange('tasks')} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Calendar" 
            active={activeView === 'calendar'} 
            onClick={() => onViewChange('calendar')} 
          />
          <SidebarItem 
            icon={Bell} 
            label="Notifications" 
            active={activeView === 'notifications'} 
            onClick={() => onViewChange('notifications')} 
          />
        </nav>

        <div className="pt-6 mt-10 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
          <SidebarItem icon={Settings} label="Settings" onClick={() => onViewChange('settings')} />
          <button
            onClick={toggleDark}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 transition-all font-semibold"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <SidebarItem icon={LogOut} label="Log Out" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
        <header className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-900 px-8 py-4 flex items-center justify-between">
          <div className="lg:hidden flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="text-lg font-bold">TaskSync</span>
          </div>
          
          <div className="hidden lg:block">
            <h1 className="text-sm font-medium text-zinc-400 capitalize">{activeView} / Home</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold">Meghnath Pal</span>
              <span className="text-xs text-zinc-400">Pro Member</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 border-2 border-white dark:border-zinc-800 shadow-sm" />
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
