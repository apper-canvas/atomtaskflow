import { motion } from 'framer-motion';

function Button({ children, className = '', onClick, type = 'button', whileHover, whileTap, ...props }) {
  // Filter out non-DOM props before passing to the button element
  const filteredProps = { ...props };
  delete filteredProps.initial;
  delete filteredProps.animate;
  delete filteredProps.transition;

  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      whileHover={whileHover}
      whileTap={whileTap}
      {...filteredProps}
    >
      {children}
    </motion.button>
  );
}

export default Button;