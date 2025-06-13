import React from 'react';

function Select({ children, className = '', value, onChange, ...props }) {
  return (
    <select
      className={`px-3 py-2 border border-surface-200 rounded-lg focus:border-primary outline-none ${className}`}
      value={value}
      onChange={onChange}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;