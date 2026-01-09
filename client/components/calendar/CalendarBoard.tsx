import React from "react";
import {
  Calendar,
  momentLocalizer,
  type Components,
  type CalendarProps,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEvent from "./CustomEvent";
import { WayfeelEvent, RbcView } from "@/types/events";
import { eventStyleGetter } from "@/lib/eventStyling";
import { CustomToolBar } from "./CustomToolBar";

const localizer = momentLocalizer(moment);

// limit to the views you actually expose
const isRbcView = (v: unknown): v is RbcView =>
  v === "month" || v === "week" || v === "day";

// Keep cast isolated and avoid `any`
const DnDCalendar = withDragAndDrop<WayfeelEvent>(
  Calendar as unknown as React.ComponentType<CalendarProps<WayfeelEvent, object>>
);

// Our unified arg type that uses your WayfeelEvent
export type DropResizeArgs = {
  event: WayfeelEvent;
  start: Date | string;
  end: Date | string;
  isAllDay?: boolean;
};

export default function CalendarBoard({
  events,
  date,
  googleConnected,
  onConnectGoogle,
  onNavigate,
  onView,
  onSelectEvent,
  onEventDrop,
  onEventResize,
}: {
  events: WayfeelEvent[];
  date: Date;
  googleConnected: boolean;
  onConnectGoogle: () => Promise<void>;
  onNavigate: (d: Date) => void;
  onView: (v: RbcView) => void;
  onSelectEvent: (e: WayfeelEvent) => void;
  onEventDrop: (args: DropResizeArgs) => void;
  onEventResize: (args: DropResizeArgs) => void;
  view: RbcView;
}) {
  const components: Components<WayfeelEvent> = {
    event: CustomEvent,
    toolbar: (props) => (
      <CustomToolBar
        onConnectGoogle={onConnectGoogle}
        onNavigate={(action: string) => {
          const newDate = new Date(date);
          if (action === 'TODAY') {
            onNavigate(new Date());
          } else if (action === 'PREV') {
            newDate.setDate(date.getDate() - 7);
            onNavigate(newDate);
          } else if (action === 'NEXT') {
            newDate.setDate(date.getDate() + 7);
            onNavigate(newDate);
          }
        } } 
        date={date} 
        googleConnected={googleConnected}
        emojis={[
        { src: '/emojis/Wayfeel_Emojis-01.png', alt: 'Emoji 1' },
        { src: '/emojis/Wayfeel_Emojis-02.png', alt: 'Emoji 2' },
        { src: '/emojis/Wayfeel_Emojis-03.png', alt: 'Emoji 3' },
        { src: '/emojis/Wayfeel_Emojis-04.png', alt: 'Emoji 4' },
        { src: '/emojis/Wayfeel_Emojis-05.png', alt: 'Emoji 5' }
    ]}      />
    )
  };

  return (
    <div className="flex-1 flex justify-center items-center p-20 ml-[4.0%] z-30">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        defaultView="week"
        views={["week"]}
        onNavigate={onNavigate}
        onView={(v) => isRbcView(v) && onView(v)}
        style={{ height: "90vh", width: "100%" }}
        eventPropGetter={eventStyleGetter}
        components={components}
        onSelectEvent={onSelectEvent}
        selectable={false}         // ⬅️ no empty-slot selection
        resizable                  // keep resize for existing events
        // ⬇️ removed onSelectSlot entirely to prevent creation
        onEventDrop={({ event, start, end, isAllDay }) =>
          onEventDrop({
            event: event as WayfeelEvent,
            start,
            end,
            isAllDay,
          })
        }
        onEventResize={({ event, start, end, isAllDay }) =>
          onEventResize({
            event: event as WayfeelEvent,
            start,
            end,
            isAllDay,
          })
        }
      />
    </div>
  );
}
