import React, { useState, useMemo, useRef, useEffect } from "react";
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
  
  // Map height will be set to match width to make it shorter than square
  // Width will be calculated based on container, so we'll use a ref callback
  const [mapHeight, setMapHeight] = useState<number>(LAYOUT_SIZES.MIN_MAP_HEIGHT);
  
  const mapContainerWidthRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateMapSize = () => {
      if (mapContainerWidthRef.current) {
        const width = mapContainerWidthRef.current.offsetWidth;
        setMapHeight(width * 0.8); // Increased from 0.75 to 0.9 for a bigger map
      }
    };
    
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);

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

      <div className="flex justify-center pt-14 px-24 lg:px-32 xl:px-40">
        <div className="w-full max-w-[1800px] relative flex items-start">
          <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />

          <main className="flex flex-col lg:flex-row flex-1 ml-28 lg:ml-32 gap-12 pt-12 lg:pt-16 px-12 lg:px-16 pb-12 lg:pb-16">
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <CalendarSection
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                calendarHeight={calendarHeight}
              />
            </div>

            <div ref={mapContainerWidthRef} className="flex-1 lg:flex-[3]">
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
