import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast, isThisWeek } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import taskService from '../services/api/taskService';
import categoryService from '../services/api/categoryService';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
  };

  const completedTasks = tasks.filter(task => task.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const todayTasks = tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate)));
  const overdueTasks = tasks.filter(task => 
    task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
  );

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProgressMessage = () => {
    if (tasks.length === 0) return "Ready to start your productive day!";
    if (completionRate === 100) return "Amazing! All tasks completed! 🎉";
    if (completionRate >= 75) return "Almost there! Keep going! 💪";
    if (completionRate >= 50) return "Great progress! You're doing well! ⭐";
    if (completionRate >= 25) return "Nice start! Keep building momentum! 🚀";
    return "Let's make today productive! ✨";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-accent';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-info';
      default: return 'border-l-surface-300';
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#5B4FE8';
  };

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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold mb-2">TaskFlow</h1>
            <p className="text-white/90">{getProgressMessage()}</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-white/80">Today's Progress</div>
              <div className="text-2xl font-bold">{completedTasks.length}/{tasks.length}</div>
            </div>
            
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionRate / 100)}`}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{completionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar */}
        <div className="w-80 bg-surface border-r border-surface-200 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-white hover:bg-surface-100 text-surface-700'
                }`}
              >
                <div className="flex items-center">
                  <ApperIcon name="Inbox" className="w-5 h-5 mr-3" />
                  All Tasks
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedCategory === 'all' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-surface-200 text-surface-600'
                }`}>
                  {tasks.length}
                </span>
              </motion.button>

              {todayTasks.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory('today')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                    selectedCategory === 'today' 
                      ? 'bg-primary text-white' 
                      : 'bg-white hover:bg-surface-100 text-surface-700'
                  }`}
                >
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" className="w-5 h-5 mr-3" />
                    Today
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === 'today' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-info/20 text-info'
                  }`}>
                    {todayTasks.length}
                  </span>
                </motion.button>
              )}

              {overdueTasks.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory('overdue')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                    selectedCategory === 'overdue' 
                      ? 'bg-primary text-white' 
                      : 'bg-white hover:bg-surface-100 text-surface-700'
                  }`}
                >
                  <div className="flex items-center">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 mr-3" />
                    Overdue
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === 'overdue' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {overdueTasks.length}
                  </span>
                </motion.button>
              )}

              <div className="pt-4 border-t border-surface-200">
                <div className="text-sm font-medium text-surface-500 mb-3">Categories</div>
                {categories.map(category => {
                  const categoryTasks = tasks.filter(task => task.category === category.name);
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left mb-2 ${
                        selectedCategory === category.name 
                          ? 'bg-primary text-white' 
                          : 'bg-white hover:bg-surface-100 text-surface-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.name}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedCategory === category.name 
                          ? 'bg-white/20 text-white' 
                          : 'bg-surface-200 text-surface-600'
                      }`}>
                        {categoryTasks.length}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Task Area */}
        <div className="flex-1 overflow-y-auto">
          <MainFeature
            tasks={filteredTasks}
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onTasksChange={setTasks}
            onCategoriesChange={setCategories}
            getPriorityColor={getPriorityColor}
            getCategoryColor={getCategoryColor}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;