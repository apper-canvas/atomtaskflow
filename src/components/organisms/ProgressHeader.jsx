import React from 'react';
import ProgressCircle from '@/components/molecules/ProgressCircle';

function ProgressHeader({ totalTasks, completedTasks, completionRate, getProgressMessage }) {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold mb-2">TaskFlow</h1>
          <p className="text-white/90">{getProgressMessage()}</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm text-white/80">Today's Progress</div>
            <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
          </div>
          
          <ProgressCircle completionRate={completionRate} />
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;