import React from "react";
import {
  Calendar,
  momentLocalizer,
  type Components,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEvent from "./CustomEvent";
import { WayfeelEvent, RbcView } from "@/types/events";
import { eventStyleGetter } from "@/lib/eventStyling";

const localizer = momentLocalizer(moment);

// limit to the views you actually expose
const isRbcView = (v: unknown): v is RbcView =>
  v === "month" || v === "week" || v === "day";

// Keep cast isolated
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DnDCalendar = withDragAndDrop<WayfeelEvent>(Calendar as unknown as React.ComponentType<any>);

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
  onNavigate,
  onView,
  onSelectEvent,
  onSelectSlot,
  onEventDrop,
  onEventResize,
}: {
  events: WayfeelEvent[];
  date: Date;
  onNavigate: (d: Date) => void;
  onView: (v: RbcView) => void;
  onSelectEvent: (e: WayfeelEvent) => void;

  onSelectSlot: (range: { start: Date; end: Date; action: "select" | "click" }) => void;
  onEventDrop: (args: DropResizeArgs) => void;
  onEventResize: (args: DropResizeArgs) => void;
}) {
  const components: Components<WayfeelEvent> = { event: CustomEvent };

  return (
    <div className="flex-1 flex justify-center items-center p-5 mt-8 ml-[4.6%] z-30">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        defaultView="week"
        views={["month", "week", "day"]}
        onNavigate={onNavigate}
        onView={(v) => isRbcView(v) && onView(v)}
        style={{ height: "90vh", width: "100%" }}
        eventPropGetter={eventStyleGetter}
        components={components}
        onSelectEvent={onSelectEvent}
        selectable
        resizable
        onSelectSlot={(slot) =>
          onSelectSlot({
            start: slot.start as Date,
            end: slot.end as Date,
            action: slot.action as "select" | "click",
          })
        }
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
