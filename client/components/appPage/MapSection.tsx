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
    <section className={`w-full ${LAYOUT_SIZES.MAP_WIDTH_LG} ${LAYOUT_SIZES.MAP_WIDTH_XL} p-4`}>
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
