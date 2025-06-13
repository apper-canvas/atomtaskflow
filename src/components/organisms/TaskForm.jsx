import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

function TaskForm({ categories, newTask, setNewTask, onAddTask, onCancelAdd, onAddKeydown }) {
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-xl shadow-card p-6 mb-6 border border-surface-200 overflow-hidden"
    >
      <div className="space-y-4">
        <Input
          ref={titleInputRef}
          type="text"
          placeholder="What needs to be done?"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="text-lg font-medium placeholder-surface-400 bg-transparent border-b-2 border-surface-200 focus:border-primary outline-none pb-2"
          onKeyDown={onAddKeydown}
          autoFocus
        />
        
        <Input
          type="textarea"
          placeholder="Add notes (optional)"
          value={newTask.notes}
          onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
          className="text-surface-600 placeholder-surface-400 bg-surface-50 border border-surface-200 rounded-lg p-3 focus:border-primary focus:bg-white outline-none resize-none"
          rows="3"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>
            
            <Select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </Select>
            
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancelAdd}
              className="px-4 py-2 text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddTask}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all shadow-card"
            >
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskForm;