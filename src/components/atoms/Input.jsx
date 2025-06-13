import React from 'react';

function Input({ type = 'text', className = '', value, onChange, placeholder, onKeyDown, autoFocus, rows, ...props }) {
  const commonProps = {
    className: `w-full px-4 py-3 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${className}`,
    value,
    onChange,
    placeholder,
    onKeyDown,
    autoFocus,
    ...props
  };

  if (type === 'textarea') {
    return <textarea rows={rows} {...commonProps}></textarea>;
  }

  return <input type={type} {...commonProps} />;
}

export default Input;