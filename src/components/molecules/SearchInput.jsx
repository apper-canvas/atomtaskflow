import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

function SearchInput({ value, onChange, placeholder = 'Search tasks...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-3"
      />
    </div>
  );
}

export default SearchInput;