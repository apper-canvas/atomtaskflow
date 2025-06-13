import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import taskService from '../services/api/taskService';
import categoryService from '../services/api/categoryService';

function MainFeature({ 
  tasks, 
  categories, 
  selectedCategory, 
  searchQuery, 
  onTasksChange, 
  onCategoriesChange,
  getPriorityColor,
  getCategoryColor 
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    notes: '',
    priority: 'medium',
    category: categories[0]?.name || '',
    dueDate: ''
  });
  const titleInputRef = useRef(null);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
        completed: false,
        createdAt: new Date(),
        completedAt: null
      };

      const createdTask = await taskService.create(taskData);
      const updatedTasks = await taskService.getAll();
      onTasksChange(updatedTasks);
      
      setNewTask({
        title: '',
        notes: '',
        priority: 'medium',
        category: categories[0]?.name || '',
        dueDate: ''
      });
      setIsAddingTask(false);
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      };

      await taskService.update(taskId, updatedTask);
      const updatedTasks = await taskService.getAll();
      onTasksChange(updatedTasks);
      
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      const updatedTasks = await taskService.getAll();
      onTasksChange(updatedTasks);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = async (taskId, updates) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = {
        ...task,
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : task.dueDate
      };

      await taskService.update(taskId, updatedTask);
      const updatedTasks = await taskService.getAll();
      onTasksChange(updatedTasks);
      setEditingTask(null);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const getFilteredTasks = () => {
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
  };

  const filteredTasks = getFilteredTasks();

  const TaskItem = ({ task }) => {
    const isEditing = editingTask === task.id;
    const [editData, setEditData] = useState({
      title: task.title,
      notes: task.notes || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
    });

    const getDueDateStatus = () => {
      if (!task.dueDate) return null;
      const dueDate = new Date(task.dueDate);
      if (isToday(dueDate)) return 'today';
      if (isPast(dueDate) && !task.completed) return 'overdue';
      return 'upcoming';
    };

    const dueDateStatus = getDueDateStatus();

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 300 }}
        whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)' }}
        className={`bg-white rounded-xl p-4 shadow-card border-l-4 transition-all ${
          getPriorityColor(task.priority)
        } ${task.completed ? 'opacity-60' : ''}`}
      >
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full font-medium text-surface-800 bg-transparent border-b border-surface-200 focus:border-primary outline-none pb-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditTask(task.id, editData);
                }
                if (e.key === 'Escape') {
                  setEditingTask(null);
                }
              }}
              autoFocus
            />
            
            <textarea
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              placeholder="Add notes..."
              className="w-full text-sm text-surface-600 bg-transparent border border-surface-200 rounded p-2 focus:border-primary outline-none resize-none"
              rows="2"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                  className="text-xs px-2 py-1 border border-surface-200 rounded focus:border-primary outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="text-xs px-2 py-1 border border-surface-200 rounded focus:border-primary outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                
                <input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                  className="text-xs px-2 py-1 border border-surface-200 rounded focus:border-primary outline-none"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditTask(task.id, editData)}
                  className="p-1 text-success hover:bg-success/10 rounded transition-colors"
                >
                  <ApperIcon name="Check" size={16} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingTask(null)}
                  className="p-1 text-surface-400 hover:bg-surface-100 rounded transition-colors"
                >
                  <ApperIcon name="X" size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleComplete(task.id)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-success border-success text-white'
                      : 'border-surface-300 hover:border-primary'
                  }`}
                >
                  {task.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <ApperIcon name="Check" size={12} />
                    </motion.div>
                  )}
                </motion.button>
                
                <div className="flex-1 min-w-0">
                  <h3 
                    className={`font-medium text-surface-800 break-words cursor-pointer hover:text-primary transition-colors ${
                      task.completed ? 'line-through' : ''
                    }`}
                    onClick={() => setEditingTask(task.id)}
                  >
                    {task.title}
                  </h3>
                  {task.notes && (
                    <p className={`text-sm text-surface-600 mt-1 break-words ${
                      task.completed ? 'line-through' : ''
                    }`}>
                      {task.notes}
                    </p>
                  )}
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteTask(task.id)}
                className="p-1 text-surface-400 hover:text-accent hover:bg-accent/10 rounded transition-all ml-2"
              >
                <ApperIcon name="Trash2" size={16} />
              </motion.button>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(task.category) }}
                  ></div>
                  <span className="text-surface-500">{task.category}</span>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' 
                    ? 'bg-accent/10 text-accent' 
                    : task.priority === 'medium'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-info/10 text-info'
                }`}>
                  {task.priority}
                </span>
              </div>
              
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${
                  dueDateStatus === 'overdue' 
                    ? 'text-accent' 
                    : dueDateStatus === 'today'
                    ? 'text-warning'
                    : 'text-surface-500'
                }`}>
                  <ApperIcon name="Calendar" size={12} />
                  <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                  {dueDateStatus === 'overdue' && <ApperIcon name="AlertCircle" size={12} />}
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="p-6 max-w-full">
      <div className="max-w-4xl mx-auto">
        {/* Add Task Form */}
        <AnimatePresence>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-card p-6 mb-6 border border-surface-200"
            >
              <div className="space-y-4">
                <input
                  ref={titleInputRef}
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full text-lg font-medium placeholder-surface-400 bg-transparent border-b-2 border-surface-200 focus:border-primary outline-none pb-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleAddTask();
                    }
                    if (e.key === 'Escape') {
                      setIsAddingTask(false);
                    }
                  }}
                  autoFocus
                />
                
                <textarea
                  placeholder="Add notes (optional)"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  className="w-full text-surface-600 placeholder-surface-400 bg-surface-50 border border-surface-200 rounded-lg p-3 focus:border-primary focus:bg-white outline-none resize-none transition-all"
                  rows="3"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="px-3 py-2 border border-surface-200 rounded-lg focus:border-primary outline-none"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                    
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="px-3 py-2 border border-surface-200 rounded-lg focus:border-primary outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="px-3 py-2 border border-surface-200 rounded-lg focus:border-primary outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsAddingTask(false)}
                      className="px-4 py-2 text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddTask}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all shadow-card"
                    >
                      Add Task
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-surface-700">
                  {searchQuery ? 'No tasks found' : selectedCategory === 'all' ? 'No tasks yet' : `No ${selectedCategory} tasks`}
                </h3>
                <p className="mt-2 text-surface-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first task to get started'}
                </p>
                {!searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddingTask(true)}
                    className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all shadow-card"
                  >
                    <ApperIcon name="Plus" className="w-5 h-5 inline mr-2" />
                    Add Your First Task
                  </motion.button>
                )}
              </motion.div>
            ) : (
              filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskItem task={task} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Floating Add Button */}
        {!isAddingTask && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAddingTask(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-hover flex items-center justify-center z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <ApperIcon name="Plus" size={24} />
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default MainFeature;