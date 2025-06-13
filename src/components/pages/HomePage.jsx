import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, isThisWeek } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon'; // Keep ApperIcon in root components/
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

import ProgressHeader from '@/components/organisms/ProgressHeader';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskSection from '@/components/organisms/TaskSection';
import Button from '@/components/atoms/Button';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const completedTasks = tasks.filter(task => task.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const todayTasks = tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate)));
  const overdueTasks = tasks.filter(task =>
    task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
  );

  const getProgressMessage = useCallback(() => {
    if (tasks.length === 0) return "Ready to start your productive day!";
    if (completionRate === 100) return "Amazing! All tasks completed! 🎉";
    if (completionRate >= 75) return "Almost there! Keep going! 💪";
    if (completionRate >= 50) return "Great progress! You're doing well! ⭐";
    if (completionRate >= 25) return "Nice start! Keep building momentum! 🚀";
    return "Let's make today productive! ✨";
  }, [tasks.length, completionRate]);

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high': return 'border-l-accent';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-info';
      default: return 'border-l-surface-300';
    }
  }, []);

  const getCategoryColor = useCallback((categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#5B4FE8'; // Default purple
  }, [categories]);

  const getFilteredAndSortedTasks = useCallback(() => {
    let filtered = tasks;

    if (selectedCategory === 'today') {
      filtered = tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate)));
    } else if (selectedCategory === 'overdue') {
      filtered = tasks.filter(task =>
        task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
      );
    } else if (selectedCategory !== 'all') {
      filtered = tasks.filter(task => task.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Incomplete tasks first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Finally by creation date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, selectedCategory, searchQuery]);

  const filteredTasks = getFilteredAndSortedTasks();


  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg w-64 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-48"></div>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 bg-surface p-6 overflow-y-auto">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-10 bg-surface-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-surface-100 rounded-xl border-l-4 border-surface-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-800 mb-2">Something went wrong</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ProgressHeader
        totalTasks={tasks.length}
        completedTasks={completedTasks.length}
        completionRate={completionRate}
        getProgressMessage={getProgressMessage}
      />

      <div className="flex-1 flex overflow-hidden">
        <CategorySidebar
          tasks={tasks}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          todayTasks={todayTasks}
          overdueTasks={overdueTasks}
          getCategoryColor={getCategoryColor}
        />
        
        <div className="flex-1 overflow-y-auto">
          <TaskSection
            tasks={filteredTasks}
            categories={categories}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onTasksChange={setTasks}
            getPriorityColor={getPriorityColor}
            getCategoryColor={getCategoryColor}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;