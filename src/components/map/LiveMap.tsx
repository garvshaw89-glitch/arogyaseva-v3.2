import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Hospital } from '../../types';
import { UserCoordinates } from '../../services/locationService';
import { Navigation, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom Pins - High Contrast Red + White Medical Theme
const userPinIcon = L.divIcon({
  className: 'custom-user-pin',
  html: `<div class="w-8 h-8 rounded-full bg-red-600/30 border-2 border-red-600 flex items-center justify-center animate-pulse"><div class="w-4 h-4 rounded-full bg-red-600 shadow-md shadow-red-600"></div></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const hospitalPinIcon = L.divIcon({
  className: 'custom-hospital-pin',
  html: `<div class="w-8 h-8 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center shadow-md shadow-red-600/40 text-white"><span style="font-size: 14px;">🏥</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

interface LiveMapProps {
  userLocation: UserCoordinates | null;
  hospitals: Hospital[];
  selectedHospital?: Hospital | null;
  routePolyline?: [number, number][];
  onSelectHospital?: (hospital: Hospital) => void;
  onStartDirections?: (hospital: Hospital) => void;
  className?: string;
}

const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export const LiveMap: React.FC<LiveMapProps> = ({
  userLocation,
  hospitals,
  selectedHospital,
  routePolyline = [],
  onSelectHospital,
  onStartDirections,
  className = 'w-full h-[450px]'
}) => {
  const defaultCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [17.6805, 74.0183];

  const activeCenter = selectedHospital
    ? [selectedHospital.latitude, selectedHospital.longitude] as [number, number]
    : defaultCenter;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={activeCenter} zoom={selectedHospital ? 14 : 12} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userPinIcon}>
            <Popup>
              <div className="text-slate-900 p-1">
                <p className="font-extrabold text-xs flex items-center gap-1 text-red-600">
                  <MapPin className="w-3.5 h-3.5" /> Patient / CHW Position
                </p>
                <p className="text-[11px] text-slate-700 font-medium mt-1">
                  Accuracy: ±{Math.round(userLocation.accuracy)}m {userLocation.isFallback ? '(Sub-village Center)' : '(GPS Live Pinpoint)'}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hospital Pins */}
        {hospitals.map((hosp) => (
          <Marker
            key={hosp.id}
            position={[hosp.latitude, hosp.longitude]}
            icon={hospitalPinIcon}
            eventHandlers={{
              click: () => onSelectHospital && onSelectHospital(hosp)
            }}
          >
            <Popup>
              <div className="p-1 min-w-[210px]">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                  {hosp.type}
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 mt-1.5 leading-tight">{hosp.name}</h4>
                <p className="text-[11px] text-slate-600 mt-1">{hosp.address}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[11px]">
                  <span className="font-bold text-slate-800">📍 {hosp.distanceKm ?? 0} km away</span>
                  <span className="font-extrabold text-emerald-700">🛏️ {hosp.icuBedsAvailable} ICU beds</span>
                </div>

                <div className="flex gap-2 mt-2.5">
                  <button
                    onClick={() => onStartDirections && onStartDirections(hosp)}
                    className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Navigation className="w-3 h-3 text-white" /> Get Directions
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Line */}
        {routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: '#DC2626',
              weight: 5,
              opacity: 0.9,
              dashArray: '8, 8'
            }}
          />
        )}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-300 shadow-md text-[11px] font-bold flex items-center gap-3 text-slate-900">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Patient Pin</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-600"></span> Hospital / ER</span>
      </div>
    </div>
  );
};
