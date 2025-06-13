import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

function CategoryButton({ name, count, iconName, color, isSelected, onClick }) {
  return (
    <Button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
        isSelected
          ? 'bg-primary text-white'
          : 'bg-white hover:bg-surface-100 text-surface-700'
      }`}
    >
      <div className="flex items-center">
        {iconName && <ApperIcon name={iconName} className="w-5 h-5 mr-3" />}
        {color && (
          <div
            className="w-3 h-3 rounded-full mr-3"
            style={{ backgroundColor: color }}
          ></div>
        )}
        {name}
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        isSelected
          ? 'bg-white/20 text-white'
          : `bg-surface-200 text-surface-600 ${color ? `bg-[${color}]/20 text-[${color}]` : ''}`
      }`}>
        {count}
      </span>
    </Button>
  );
}

export default CategoryButton;