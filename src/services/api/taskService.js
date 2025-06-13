import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('taskflow_tasks');
      if (stored) {
        this.tasks = JSON.parse(stored).map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          completedAt: task.completedAt ? new Date(task.completedAt) : null
        }));
      }
    } catch (error) {
      console.error('Failed to load tasks from storage:', error);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Failed to save tasks to storage:', error);
    }
  }

  async getAll() {
    await delay(200);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date(),
      completedAt: null
    };
    this.tasks.push(newTask);
    this.saveToStorage();
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    this.saveToStorage();
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  async getByCategory(category) {
    await delay(200);
    return this.tasks.filter(task => task.category === category);
  }

  async getCompleted() {
    await delay(200);
    return this.tasks.filter(task => task.completed);
  }

  async getPending() {
    await delay(200);
    return this.tasks.filter(task => !task.completed);
  }
}

export default new TaskService();