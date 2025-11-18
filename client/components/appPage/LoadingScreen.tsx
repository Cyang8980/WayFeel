import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="loader mb-4"></div>
        <p className="text-xl font-medium">Loading, please wait...</p>
      </div>
    </div>
  );
};
