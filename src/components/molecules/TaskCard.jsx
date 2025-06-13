import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

function TaskCard({ 
  task, 
  categories, 
  onToggleComplete, 
  onDeleteTask, 
  onEditTask, 
  getPriorityColor, 
  getCategoryColor 
}) {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSaveEdit = () => {
    if (!editData.title.trim()) {
      alert('Task title cannot be empty.'); // Or use toast from parent
      return;
    }
    onEditTask(task.id, editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: task.title,
      notes: task.notes || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
    });
    setIsEditing(false);
  };

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
          <Input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full font-medium text-surface-800 bg-transparent border-b border-surface-200 focus:border-primary outline-none pb-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveEdit();
              }
              if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            autoFocus
          />
          
          <Input
            type="textarea"
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            placeholder="Add notes..."
            className="w-full text-sm text-surface-600 bg-transparent border border-surface-200 rounded p-2 focus:border-primary outline-none resize-none"
            rows="2"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                className="text-xs px-2 py-1"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
              
              <Select
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                className="text-xs px-2 py-1"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </Select>
              
              <Input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                className="text-xs px-2 py-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveEdit}
                className="p-1 text-success hover:bg-success/10 rounded transition-colors"
              >
                <ApperIcon name="Check" size={16} />
              </Button>
              <Button
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                className="p-1 text-surface-400 hover:bg-surface-100 rounded transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <Button
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleComplete(task.id)}
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
              </Button>
              
              <div className="flex-1 min-w-0">
                <h3 
                  className={`font-medium text-surface-800 break-words cursor-pointer hover:text-primary transition-colors ${
                    task.completed ? 'line-through' : ''
                  }`}
                  onClick={() => setIsEditing(true)}
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
            
            <Button
              whileTap={{ scale: 0.95 }}
              onClick={() => onDeleteTask(task.id)}
              className="p-1 text-surface-400 hover:text-accent hover:bg-accent/10 rounded transition-all ml-2"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
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
}

export default TaskCard;