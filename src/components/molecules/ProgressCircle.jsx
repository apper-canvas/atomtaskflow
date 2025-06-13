import React from 'react';

function ProgressCircle({ completionRate }) {
  const circumference = 2 * Math.PI * 28; // r="28"

  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference * (1 - completionRate / 100)}`}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold">{completionRate}%</span>
      </div>
    </div>
  );
}

export default ProgressCircle;