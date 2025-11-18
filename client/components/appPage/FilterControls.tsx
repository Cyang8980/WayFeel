import React from 'react';
import { MARKER_VIEW_OPTIONS, MarkerViewType } from '@/lib/appPageConstants';

interface FilterControlsProps {
  selectedView: MarkerViewType;
  onViewChange: (view: MarkerViewType) => void;
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedView,
  onViewChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onViewChange(e.target.value as MarkerViewType);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStartDate = e.target.valueAsDate;
    if (endDate && selectedStartDate && selectedStartDate > endDate) {
      alert('Start date cannot be after end date');
      return;
    }
    onStartDateChange(selectedStartDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = e.target.valueAsDate;
    if (startDate && selectedEndDate && selectedEndDate < startDate) {
      alert('End date cannot be before start date');
      return;
    }
    onEndDateChange(selectedEndDate);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col md:flex-row gap-4 -mt-6">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">View</label>
        <select className="w-full p-2 border rounded" value={selectedView} onChange={handleViewChange}>
          {MARKER_VIEW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          onChange={handleStartDateChange}
          max={endDate?.toISOString().split('T')[0]}
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          onChange={handleEndDateChange}
          min={startDate?.toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};
