import React from 'react';
import SearchInput from '@/components/molecules/SearchInput';
import CategoryButton from '@/components/molecules/CategoryButton';
import ApperIcon from '@/components/ApperIcon';

function CategorySidebar({
  tasks,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  todayTasks,
  overdueTasks,
  getCategoryColor // Pass this down from HomePage
}) {
  return (
    <div className="w-80 bg-surface border-r border-surface-200 overflow-y-auto flex-shrink-0">
      <div className="p-6">
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <CategoryButton
            name="All Tasks"
            count={tasks.length}
            iconName="Inbox"
            isSelected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          />

          {todayTasks.length > 0 && (
            <CategoryButton
              name="Today"
              count={todayTasks.length}
              iconName="Calendar"
              isSelected={selectedCategory === 'today'}
              onClick={() => setSelectedCategory('today')}
              color="var(--color-info)" // Use CSS variable or explicit color
            />
          )}

          {overdueTasks.length > 0 && (
            <CategoryButton
              name="Overdue"
              count={overdueTasks.length}
              iconName="AlertTriangle"
              isSelected={selectedCategory === 'overdue'}
              onClick={() => setSelectedCategory('overdue')}
              color="var(--color-accent)" // Use CSS variable or explicit color
            />
          )}

          <div className="pt-4 border-t border-surface-200">
            <div className="text-sm font-medium text-surface-500 mb-3">Categories</div>
            {categories.map(category => {
              const categoryTasks = tasks.filter(task => task.category === category.name);
              return (
                <CategoryButton
                  key={category.id}
                  name={category.name}
                  count={categoryTasks.length}
                  color={getCategoryColor(category.name)}
                  isSelected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategorySidebar;