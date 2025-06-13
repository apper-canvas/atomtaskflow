import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
  }

  async getAll() {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "notes" } },
          { "Field": { "Name": "completed" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "category" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "created_at" } },
          { "Field": { "Name": "completed_at" } },
          { "Field": { "Name": "CreatedOn" } },
          { "Field": { "Name": "ModifiedOn" } }
        ],
        "orderBy": [
          {
            "FieldName": "CreatedOn",
            "SortType": "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI format
      const tasks = response.data?.map(task => ({
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        notes: task.notes || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        category: task.category || '',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        createdAt: task.created_at ? new Date(task.created_at) : (task.CreatedOn ? new Date(task.CreatedOn) : new Date()),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];

      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ["Id", "Name", "title", "notes", "completed", "priority", "category", "due_date", "created_at", "completed_at", "CreatedOn", "ModifiedOn"]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const task = response.data;
      return {
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        notes: task.notes || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        category: task.category || '',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        createdAt: task.created_at ? new Date(task.created_at) : (task.CreatedOn ? new Date(task.CreatedOn) : new Date()),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          title: taskData.title,
          notes: taskData.notes || '',
          completed: taskData.completed || false,
          priority: taskData.priority || 'medium',
          category: taskData.category || '',
          due_date: taskData.dueDate ? taskData.dueDate.toISOString() : null,
          created_at: new Date().toISOString(),
          completed_at: taskData.completedAt ? taskData.completedAt.toISOString() : null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          return {
            id: createdTask.Id?.toString(),
            title: createdTask.title || createdTask.Name || '',
            notes: createdTask.notes || '',
            completed: createdTask.completed || false,
            priority: createdTask.priority || 'medium',
            category: createdTask.category || '',
            dueDate: createdTask.due_date ? new Date(createdTask.due_date) : null,
            createdAt: createdTask.created_at ? new Date(createdTask.created_at) : (createdTask.CreatedOn ? new Date(createdTask.CreatedOn) : new Date()),
            completedAt: createdTask.completed_at ? new Date(createdTask.completed_at) : null
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      return null;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate ? updates.dueDate.toISOString() : null;
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt ? updates.completedAt.toISOString() : null;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            id: updatedTask.Id?.toString(),
            title: updatedTask.title || updatedTask.Name || '',
            notes: updatedTask.notes || '',
            completed: updatedTask.completed || false,
            priority: updatedTask.priority || 'medium',
            category: updatedTask.category || '',
            dueDate: updatedTask.due_date ? new Date(updatedTask.due_date) : null,
            createdAt: updatedTask.created_at ? new Date(updatedTask.created_at) : (updatedTask.CreatedOn ? new Date(updatedTask.CreatedOn) : new Date()),
            completedAt: updatedTask.completed_at ? new Date(updatedTask.completed_at) : null
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "notes" } },
          { "Field": { "Name": "completed" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "category" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "created_at" } },
          { "Field": { "Name": "completed_at" } }
        ],
        "where": [
          {
            "FieldName": "category",
            "Operator": "ExactMatch",
            "Values": [category]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }

      return response.data?.map(task => ({
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        notes: task.notes || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        category: task.category || '',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        createdAt: task.created_at ? new Date(task.created_at) : new Date(),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      return [];
    }
  }

  async getCompleted() {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "notes" } },
          { "Field": { "Name": "completed" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "category" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "created_at" } },
          { "Field": { "Name": "completed_at" } }
        ],
        "where": [
          {
            "FieldName": "completed",
            "Operator": "ExactMatch",
            "Values": [true]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }

      return response.data?.map(task => ({
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        notes: task.notes || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        category: task.category || '',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        createdAt: task.created_at ? new Date(task.created_at) : new Date(),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      return [];
    }
  }

  async getPending() {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "notes" } },
          { "Field": { "Name": "completed" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "category" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "created_at" } },
          { "Field": { "Name": "completed_at" } }
        ],
        "where": [
          {
            "FieldName": "completed",
            "Operator": "ExactMatch",
            "Values": [false]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }

      return response.data?.map(task => ({
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        notes: task.notes || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        category: task.category || '',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        createdAt: task.created_at ? new Date(task.created_at) : new Date(),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
      return [];
    }
  }
}
export default new TaskService();