import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUser, SignInButton } from "@clerk/nextjs";
import { CustomUserButton } from "../profile/[[...index]]";
import Sidebar from "@/Components/sidebar";;

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const { isSignedIn } = useUser();
    const [currentDate, setCurrentDate] = useState(new Date());
    const events = [
        { title: "Event 1", start: new Date(), end: new Date() },
        { title: "Event 2", start: new Date(), end: new Date() },
    ];
    const [activeItem, setActiveItem] = useState("home");


    return (
        <div className="h-screen flex flex-col">
            <nav className="bg-gray-800 text-white fixed w-full z-10 flex justify-between items-center px-4 py-3">
                <h1 className="text-xl font-bold">Wayfeel</h1>
                <div>
                    {!isSignedIn ? (
                        <SignInButton>
                            <button className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    ) : (
                        <CustomUserButton />
                    )}
                </div>
            </nav>
            <div className="w-1/6 fixed top-16 left-0 p-4">
                <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
            </div>
            {isSignedIn ? (
                <div className="flex-1 flex justify-center items-center p-4">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        date={currentDate}
                        onNavigate={(date) => setCurrentDate(date)}
                        style={{ height: "90vh", width: "90vw" }}
                        className="shadow-lg rounded-lg bg-white p-4"
                    />
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-xl font-semibold">Please sign in to view the calendar.</p>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
