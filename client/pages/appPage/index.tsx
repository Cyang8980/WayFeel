import React, { useState, useMemo } from "react";
import Sidebar from "../../components/sidebar";
import EventModal from "@/components/EventModal";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useMapInitialization } from "../../hooks/useMapInitialization";
import { useAuthentication } from "../../hooks/useAuthentication";
import { FilterControls } from "../../components/appPage/FilterControls";
import { CalendarSection } from "../../components/appPage/CalendarSection";
import { MapSection } from "../../components/appPage/MapSection";
import { LoadingScreen } from "../../components/appPage/LoadingScreen";
import { LAYOUT_SIZES, MarkerViewType } from "@/lib/appPageConstants";

const Index = () => {
  // UI State
  const [activeItem, setActiveItem] = useState("home");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Filter State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedView, setSelectedView] = useState<MarkerViewType>("personal");

  // Custom Hooks
  const { height: windowHeight } = useWindowSize();
  const { isLoading } = useAuthentication();
  const {
    mapContainerRef,
    mapScriptLoaded,
    selectedMarker,
    isEventModalOpen,
    setIsEventModalOpen,
  } = useMapInitialization({
    startDate,
    endDate,
    selectedView,
  });

  // Preserving exact original size calculations
  const calendarHeight = useMemo(
    () => Math.max(windowHeight * LAYOUT_SIZES.CALENDAR_HEIGHT_RATIO, LAYOUT_SIZES.MIN_CALENDAR_HEIGHT),
    [windowHeight]
  );
  
  const mapHeight = useMemo(
    () => Math.max(windowHeight * LAYOUT_SIZES.MAP_HEIGHT_RATIO, LAYOUT_SIZES.MIN_MAP_HEIGHT),
    [windowHeight]
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#f9f0f0]">
      <nav className="bg-gray-800 text-white fixed w-full z-10"></nav>

      {isEventModalOpen && selectedMarker && (
        <EventModal
          event={selectedMarker}
          onClose={() => setIsEventModalOpen(false)}
          mapScriptLoaded={mapScriptLoaded}
        />
      )}

      <div className="flex pt-14">
        <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />

        <main className="flex flex-col lg:flex-row flex-1 ml-28 lg:ml-32 mr-4 lg:mr-[8%] gap-4 p-4">
          <CalendarSection
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            calendarHeight={calendarHeight}
          />

          <MapSection mapContainerRef={mapContainerRef} mapHeight={mapHeight}>
            <FilterControls
              selectedView={selectedView}
              onViewChange={setSelectedView}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </MapSection>
        </main>
      </div>
    </div>
  );
};

export default Index;
