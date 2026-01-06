import React, { useMemo } from 'react';
import moment from 'moment';
import Image from 'next/image';
import EventList from '../eventsComponent';
import { useUser } from '@clerk/nextjs';
import useMarkers from '@/hooks/useMarkers';
import { emojiColorMap } from '@/lib/constants';

interface CalendarSectionProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  calendarHeight: number;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  currentDate,
  onDateChange,
  calendarHeight,
}) => {
  const { user } = useUser();
  const events = useMarkers(user?.id);

  // Get events for the current month
  const monthEvents = useMemo(() => {
    const startOfMonth = moment(currentDate).startOf('month').toDate();
    const endOfMonth = moment(currentDate).endOf('month').toDate();
    return events.filter(event => {
      const eventDate = moment(event.start);
      return eventDate.isSameOrAfter(startOfMonth) && eventDate.isSameOrBefore(endOfMonth);
    });
  }, [events, currentDate]);

  // Create a map of dates to event colors
  const dateColors = useMemo(() => {
    const colors: Record<number, string> = {};
    monthEvents.forEach(event => {
      const day = moment(event.start).date();
      if (event.emojiId) {
        colors[day] = emojiColorMap[event.emojiId] || '#E8E8E8';
      }
    });
    return colors;
  }, [monthEvents]);

  // Get calendar grid
  const calendarDays = useMemo(() => {
    const startOfMonth = moment(currentDate).startOf('month');
    const endOfMonth = moment(currentDate).endOf('month');
    const startDate = startOfMonth.clone().startOf('week'); // Start from Sunday
    const endDate = endOfMonth.clone().endOf('week'); // End on Saturday
    
    const days = [];
    const current = startDate.clone();
    
    while (current.isSameOrBefore(endDate)) {
      days.push({
        date: current.date(),
        isCurrentMonth: current.month() === startOfMonth.month(),
        isToday: current.isSame(moment(), 'day'),
        fullDate: current.clone(),
      });
      current.add(1, 'day');
    }
    
    return days;
  }, [currentDate]);

  const monthName = moment(currentDate).format('MMM');
  const year = moment(currentDate).format('YYYY');

  const handlePrevMonth = () => {
    onDateChange(moment(currentDate).subtract(1, 'month').toDate());
  };

  const handleNextMonth = () => {
    onDateChange(moment(currentDate).add(1, 'month').toDate());
  };

  return (
    <section className="px-4 pb-4">
      <div className="bg-gray-100 rounded-[60px] shadow-lg p-4" style={{ minHeight: `${calendarHeight}px` }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-2">
          <button 
            onClick={handlePrevMonth}
            className="text-gray-600 hover:text-gray-800 text-lg font-bold"
          >
            ‹
          </button>
          <div className="flex items-center justify-between w-full mx-4">
            <span className="font-bold text-gray-800 text-lg">{monthName}</span>
            <span className="text-gray-600">{year}</span>
          </div>
          <button 
            onClick={handleNextMonth}
            className="text-gray-600 hover:text-gray-800 text-lg font-bold"
          >
            ›
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="font-semibold text-gray-600 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-xs text-center">
          {calendarDays.map((day, index) => {
            const hasEvent = dateColors[day.date];
            const isOtherMonth = !day.isCurrentMonth;
            
            return (
              <div
                key={index}
                className={`py-2 text-gray-700 relative ${
                  isOtherMonth ? 'text-gray-400' : ''
                } ${day.isToday ? 'font-bold' : ''}`}
              >
                {day.date}
                {hasEvent && !isOtherMonth && (
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: hasEvent }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Horizontal Emoji List */}
      <div className="my-4 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-center items-center gap-3 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((emojiIndex) => (
            <div
              key={emojiIndex}
              className="flex-shrink-0"
            >
              <Image
                src={`/emojis/Wayfeel_Emojis-0${emojiIndex}.png`}
                alt={`Emoji ${emojiIndex}`}
                width={60}
                height={60}
                className="select-none"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <EventList />
      </div>
    </section>
  );
};
