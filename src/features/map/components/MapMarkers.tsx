
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { MarkerData } from '../types';
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
          <Marker
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
            onMouseOver={() => onMarkerHover?.(marker.locationId)}
            onMouseOut={() => onMarkerHover?.(null)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="${isSelected ? '#1976d2' : isHovered ? '#1976d280' : 'white'}" 
                          stroke="${isSelected || isHovered ? '#ffffff' : '#1976d2'}" stroke-width="2"/>
                  <g transform="translate(12, 12)">
                    ${type === 'restaurant' ? '<path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 20 12 16.77 5.82 20 7 13.87 2 9l6.91-.74L12 2z" fill="currentColor"/>' : 
                      type === 'grocery' ? '<path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1z" fill="currentColor"/>' :
                      '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>'}
                  </g>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }}
          />
        );
      })}
    </>
  );
};

export default MapMarkers;
