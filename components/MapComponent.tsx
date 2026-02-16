
import React, { useEffect, useRef } from 'react';

declare const L: any;

interface MapComponentProps {
  origin?: string;
  destination?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ origin, destination }) => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([-15.7801, -47.9292], 4);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-48 sm:h-64 rounded-[2rem] overflow-hidden shadow-inner border border-gray-100 bg-gray-50 relative">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 z-[10] bg-white/80 backdrop-blur px-2 py-1 rounded-lg text-[8px] font-black text-gray-400 uppercase tracking-widest">
        Live Map
      </div>
    </div>
  );
};

export default MapComponent;
