import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '../types';
import { Navigation } from 'lucide-react';

interface MapComponentProps {
  places: Place[];
  center: { lat: number; lng: number };
  onSelectPlace: (place: Place) => void;
}

const ChangeView: React.FC<{ center: { lat: number; lng: number } }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 13);
    // Force invalidation to fix gray tiles
    map.invalidateSize(); 
  }, [center, map]);
  return null;
};

// Wrapper component for Marker to handle events safely
const PlaceMarker: React.FC<{ place: Place; onSelect: (p: Place) => void; icon: L.Icon }> = ({ place, onSelect, icon }) => {
    const markerRef = useRef<any>(null);

    useEffect(() => {
        const marker = markerRef.current;
        if (!marker) return;

        const handler = () => onSelect(place);
        marker.on('click', handler);

        return () => {
            marker.off('click', handler);
        };
    }, [place, onSelect]);

    return (
        <Marker 
            ref={markerRef}
            position={[place.lat, place.lng]}
            icon={icon}
        >
            <Popup>
              <div className="font-sans min-w-[150px]">
                <h3 className="font-bold text-sm text-blue-900">{place.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{place.category}</p>
                <button 
                  onClick={() => onSelect(place)}
                  className="w-full text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 py-1.5 rounded flex items-center justify-center font-medium transition-colors"
                >
                  <Navigation size={10} className="mr-1" /> ดูรายละเอียด
                </button>
              </div>
            </Popup>
        </Marker>
    );
};

const MapComponent: React.FC<MapComponentProps> = ({ places, center, onSelectPlace }) => {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fix for Leaflet icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  // Memoize icons to prevent recreation on render
  const icons = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    // Helper to create colored markers using a reliable CDN
    const createIcon = (colorUrl: string) => new L.Icon({
        iconUrl: colorUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return {
        // Red marker for user
        user: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'),
        // Blue marker for places
        place: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png')
    };
  }, []);

  if (!mounted || !icons) return <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">กำลังโหลดแผนที่...</div>;

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 z-0 relative isolate">
      <MapContainer 
        ref={mapRef}
        center={[center.lat, center.lng]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker (RED) */}
        <Marker position={[center.lat, center.lng]} icon={icons.user}>
             <Popup>ตำแหน่งของคุณ</Popup>
        </Marker>

        {/* Places Markers (BLUE) */}
        {places.map((place) => (
          <PlaceMarker 
            key={place.id} 
            place={place} 
            onSelect={onSelectPlace}
            icon={icons.place}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;