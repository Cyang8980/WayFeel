import React, { RefObject } from 'react';
import { LAYOUT_SIZES } from '@/lib/appPageConstants';

interface MapSectionProps {
  mapContainerRef: RefObject<HTMLDivElement>;
  mapHeight: number;
  children?: React.ReactNode;
}

export const MapSection: React.FC<MapSectionProps> = ({
  mapContainerRef,
  mapHeight,
  children,
}) => {
  return (
    <section className="w-full p-5">
      {children}
      <div
        ref={mapContainerRef}
        id="map"
        style={{ height: `${mapHeight}px`, width: '100%' }}
        className="rounded-lg shadow-lg mb-4"
      />
    </section>
  );
};
