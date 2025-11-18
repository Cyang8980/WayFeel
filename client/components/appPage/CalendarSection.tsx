import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import EventList from '../eventsComponent';
import { LAYOUT_SIZES } from '@/lib/appPageConstants';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

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
  return (
    <section className={` ${LAYOUT_SIZES.CALENDAR_WIDTH_LG} ${LAYOUT_SIZES.CALENDAR_WIDTH_XL} p-4`}>
      <div>
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={onDateChange}
          style={{ height: `${calendarHeight}px`, width: '100%' }}
          className="shadow-lg rounded-lg bg-white p-4"
          toolbar={false}
        />
      </div>
      <div>
        <EventList />
      </div>
    </section>
  );
};
