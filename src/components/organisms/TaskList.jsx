import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function TaskList({
  tasks,
  categories,
  searchQuery,
  selectedCategory,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  getPriorityColor,
  getCategoryColor,
  onAddFirstTask,
  isAddingTask,
  onShowAddTaskForm
}) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onAddFirstTask={onAddFirstTask}
          />
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskCard
                task={task}
                categories={categories}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                getPriorityColor={getPriorityColor}
                getCategoryColor={getCategoryColor}
              />
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* Floating Add Button */}
      {!isAddingTask && (
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onShowAddTaskForm}
          className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-hover flex items-center justify-center z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <ApperIcon name="Plus" size={24} />
        </Button>
      )}
    </div>
  );
}

export default TaskList;