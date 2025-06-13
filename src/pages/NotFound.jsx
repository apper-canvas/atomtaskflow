import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-display font-bold text-surface-800 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-surface-600 mb-8 max-w-md">
          The page you're looking for doesn't exist. Let's get you back to managing your tasks.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all shadow-card"
        >
          Back to TaskFlow
        </motion.button>
      </motion.div>
    </div>
  );
}

export default NotFound;