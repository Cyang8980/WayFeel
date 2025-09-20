import React from 'react';
import { MarkerFilterOptions } from '@/pages/api/getMarkers';

interface MapControlsProps {
  loadCustomMarkers: (filters: MarkerFilterOptions) => Promise<void>;
}

export const MapControls: React.FC<MapControlsProps> = ({ loadCustomMarkers }) => {
  const handleLoadPersonalMarkers = async () => {
    await loadCustomMarkers({
      user_id: 'current-user-id', // You would get this from context or props
      anonFilter: 'all'
    });
  };

  const handleLoadAnonymousMarkers = async () => {
    await loadCustomMarkers({
      anonFilter: 'only'
    });
  };

  const handleLoadAllMarkers = async () => {
    await loadCustomMarkers({
      anonFilter: 'all'
    });
  };

  const handleLoadRecentMarkers = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    await loadCustomMarkers({
      startDate: oneWeekAgo,
      endDate: new Date(),
      anonFilter: 'all'
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-4">Map Controls</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleLoadPersonalMarkers}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Load Personal
        </button>
        <button
          onClick={handleLoadAnonymousMarkers}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Load Anonymous
        </button>
        <button
          onClick={handleLoadAllMarkers}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Load All
        </button>
        <button
          onClick={handleLoadRecentMarkers}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Load Recent (1 week)
        </button>
      </div>
    </div>
  );
};
