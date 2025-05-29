import React, { useState } from 'react';
import { AdvancedMarker, MarkerData } from '../types';
import { MapPin, Utensils, ShoppingCart, Leaf } from 'lucide-react';

interface MapMarkersProps {
  markers: MarkerData[];
  selectedLocationId?: string | null;
  hoveredLocationId?: string | null;
  onMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  onMarkerHover?: (locationId: string | null) => void;
}

const getMarkerIcon = (type: string, isHighlighted: boolean) => {
  const iconClass = `h-4 w-4 ${isHighlighted ? 'text-white' : 'text-primary'}`;
  
  switch (type.toLowerCase()) {
    case 'restaurant':
      return <Utensils className={iconClass} />;
    case 'grocery':
      return <ShoppingCart className={iconClass} />;
    case 'farmersmarket':
      return <Leaf className={iconClass} />;
    default:
      return <MapPin className={iconClass} />;
  }
};

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  markers, 
  selectedLocationId,
  hoveredLocationId,
  onMarkerClick,
  onMarkerHover
}) => {
  return (
    <>
      {markers.map((marker) => {
        const isSelected = selectedLocationId === marker.locationId;
        const isHovered = hoveredLocationId === marker.locationId;
        
        return (
          <AdvancedMarker
            key={marker.locationId}
            position={marker.position}
            onClick={(e) => {
              const domEvent = e.domEvent as MouseEvent;
              const rect = (domEvent.target as HTMLElement).getBoundingClientRect();
              onMarkerClick(marker.locationId, {
                x: rect.left + rect.width / 2,
                y: rect.top
              });
            }}
            onMouseEnter={() => onMarkerHover?.(marker.locationId)}
            onMouseLeave={() => onMarkerHover?.(null)}
          >
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 
              transition-all duration-200 cursor-pointer
              ${isSelected 
                ? 'bg-primary border-primary-foreground scale-125 shadow-lg' 
                : isHovered
                ? 'bg-primary/80 border-primary-foreground scale-110 shadow-md'
                : 'bg-white border-primary shadow-sm hover:scale-105'
              }
            `}>
              {getMarkerIcon(marker.type, isSelected || isHovered)}
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default MapMarkers;
