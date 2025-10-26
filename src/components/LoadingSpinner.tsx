import React from 'react';
const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-overlay"> 
      <div className="loading-content">
        <div className="loading-cube"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;