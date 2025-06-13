import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function EmptyState({ searchQuery, selectedCategory, onAddFirstTask }) {
  const message = searchQuery 
    ? 'No tasks found' 
    : selectedCategory === 'all' 
      ? 'No tasks yet' 
      : `No ${selectedCategory} tasks`;

  const description = searchQuery 
    ? 'Try adjusting your search terms' 
    : 'Create your first task to get started';

  return (
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
        {message}
      </h3>
      <p className="mt-2 text-surface-500">
        {description}
      </p>
      {!searchQuery && (
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddFirstTask}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all shadow-card"
        >
          <ApperIcon name="Plus" className="w-5 h-5 inline mr-2" />
          Add Your First Task
        </Button>
      )}
    </motion.div>
  );
}

export default EmptyState;