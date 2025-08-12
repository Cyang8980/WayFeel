import React from "react";
import {
  Calendar,
  momentLocalizer,
  type Components,          // <- types
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEvent from "./CustomEvent";
import { WayfeelEvent, RbcView } from "@/types/events";
import { eventStyleGetter } from "@/lib/eventStyling";

const localizer = momentLocalizer(moment);

// limit to the views you actually expose
const isRbcView = (v: unknown): v is RbcView =>
  v === "month" || v === "week" || v === "day";

export default function CalendarBoard({
  events,
  date,
  onNavigate,
  onView,
  onSelectEvent,
}: {
  events: WayfeelEvent[];
  date: Date;
  onNavigate: (d: Date) => void;
  onView: (v: RbcView) => void;
  onSelectEvent: (e: WayfeelEvent) => void;
}) {
  // fully typed components map (no `as any`)
  const components: Components<WayfeelEvent> = {
    event: CustomEvent,
  };

  return (
    <div className="flex-1 flex justify-center items-center p-5 mt-8 ml-[4.6%] z-30">
      <Calendar<WayfeelEvent>
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        defaultView="week"
        views={["month", "week", "day"]}
        onNavigate={onNavigate}
        onView={(v) => {
          if (isRbcView(v)) onView(v);
        }}
        style={{ height: "90vh", width: "100%" }}
        eventPropGetter={eventStyleGetter}
        components={components}
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
}
