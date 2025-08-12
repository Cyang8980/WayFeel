import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEvent from "./CustomEvent";
import { WayfeelEvent, RbcView } from "@/types/events";
import { eventStyleGetter } from "@/lib/eventStyling";

const localizer = momentLocalizer(moment);

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
  return (
    <div className="flex-1 flex justify-center items-center p-5 mt-8 ml-[4.6%] z-30">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        defaultView="week"
        views={["month", "week", "day"]}
        onNavigate={onNavigate}
        onView={(v) => onView(v as RbcView)}
        style={{ height: "90vh", width: "100%" }}
        eventPropGetter={eventStyleGetter}
        components={{ event: CustomEvent as any }}
        onSelectEvent={(e) => onSelectEvent(e as WayfeelEvent)}
      />
    </div>
  );
}
