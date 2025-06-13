import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';
import TaskForm from '@/components/organisms/TaskForm';
import TaskList from '@/components/organisms/TaskList';

function TaskSection({
  tasks,
  categories,
  searchQuery,
  selectedCategory,
  onTasksChange,
  getPriorityColor,
  getCategoryColor
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    notes: '',
    priority: 'medium',
    category: categories[0]?.name || '',
    dueDate: ''
  });

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

      await taskService.create(taskData);
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
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleAddKeydown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddTask();
    }
    if (e.key === 'Escape') {
      setIsAddingTask(false);
    }
  };

  return (
    <div className="p-6 max-w-full">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {isAddingTask && (
            <TaskForm
              categories={categories}
              newTask={newTask}
              setNewTask={setNewTask}
              onAddTask={handleAddTask}
              onCancelAdd={() => setIsAddingTask(false)}
              onAddKeydown={handleAddKeydown}
            />
          )}
        </AnimatePresence>

        <TaskList
          tasks={tasks} // These are already filtered tasks from HomePage
          categories={categories}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          getPriorityColor={getPriorityColor}
          getCategoryColor={getCategoryColor}
          onAddFirstTask={() => setIsAddingTask(true)}
          isAddingTask={isAddingTask}
          onShowAddTaskForm={() => setIsAddingTask(true)}
        />
      </div>
    </div>
  );
}

export default TaskSection;