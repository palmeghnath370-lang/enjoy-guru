export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Personal' | 'Work' | 'Learning' | 'Health' | 'Other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  progress: number; // 0 to 100
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  averageProgress: number;
  categoryDistribution: { name: string; value: number }[];
}
