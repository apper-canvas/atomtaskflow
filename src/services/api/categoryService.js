import categoriesData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('taskflow_categories');
      if (stored) {
        this.categories = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load categories from storage:', error);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('taskflow_categories', JSON.stringify(this.categories));
    } catch (error) {
      console.error('Failed to save categories to storage:', error);
    }
  }

  async getAll() {
    await delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await delay(200);
    const category = this.categories.find(c => c.id === id);
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      taskCount: 0
    };
    this.categories.push(newCategory);
    this.saveToStorage();
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories[index] = { ...this.categories[index], ...updates };
    this.saveToStorage();
    return { ...this.categories[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories.splice(index, 1);
    this.saveToStorage();
    return true;
  }
}

export default new CategoryService();