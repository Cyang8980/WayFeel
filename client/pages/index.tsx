import React, { useState, useEffect, useRef } from "react";
import { initMap } from "./api/map";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Sidebar from "../Components/sidebar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { CustomUserButton } from "./profile/[[...index]]";
// import kofiImage from "./support_me_on_kofi.png";

// Localizer for react-big-calendar
const localizer = momentLocalizer(moment);


const Index = () => {
  const { isSignedIn } = useUser();
  // const [message, setMessage] = useState("Loading...");
  const [activeItem, setActiveItem] = useState("home");
  const [currentDate, setCurrentDate] = useState(new Date());

  const googleMapsRef = useRef<google.maps.Map | null>(null);

  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      googleMapsRef.current = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 37.7749, lng: -122.4194 }, // Set default map center (example: San Francisco)
          zoom: 10,
        }
      );
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          googleMapsRef.current = new window.google.maps.Map(
            document.getElementById("map") as HTMLElement,
            {
              center: { lat: 37.7749, lng: -122.4194 }, // Set default map center
              zoom: 10,
            }
          );
          initMap(); // Ensure this is only called once the script is loaded
        }
      };
      document.head.appendChild(script);

      // Define the initMap function globally so Google Maps can call it once the script is loaded
      window.initMap = () => {
        if (window.google && window.google.maps) {
          googleMapsRef.current = new window.google.maps.Map(
            document.getElementById("map") as HTMLElement,
            {
              center: { lat: 37.7749, lng: -122.4194 },
              zoom: 10,
            }
          );
          initMap();
        }
      };
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white fixed w-full z-10">
      </nav>

      {/* Page Layout */}
      <div className="flex pt-14">
        {/* Sidebar */}
        <div className="w-1/6 fixed top-16 left-0 p-4">
          <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
        </div>

        {/* Content Area */}
        <main className="flex flex-1 ml-[5%] space-x-[3%] space-y-[2%]">
          <section className="w-[25%] p-4">
            <div style={{ height: '470px' }}>
              AI location recommendation goes here
            </div>
            <Calendar
              localizer={localizer}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              style={{ height: '310px', width: '100%' }}
              className="shadow-lg rounded-lg bg-white p-4"
              toolbar={false}
            />
          </section>

          <section className="w-[65%] p-4">
            <div
              id="map"
              style={{ height: '745px', width: '100%' }}
              className="rounded-lg shadow-lg mb-4"
            ></div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
