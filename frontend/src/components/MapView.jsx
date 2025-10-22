import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Calendar, Users, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { parseDate } from '../utils/helpers';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (isFuture) => {
  const color = isFuture ? '#06b6d4' : '#a855f7'; // cyan-500 : purple-500

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        ${isFuture ? 'animation: pulse 2s infinite;' : ''}
      ">
        <div style="
          color: white;
          font-size: 16px;
          transform: rotate(45deg);
        ">♪</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to fit map bounds to markers
function MapBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [positions, map]);

  return null;
}

// Simple geocoding using city and country names
// This is a basic implementation - in production, you'd use a real geocoding API
const geocodeLocation = (city, country) => {
  // Database of major cities (simplified for demo)
  const cityCoordinates = {
    // USA
    'New York': [40.7128, -74.0060],
    'Los Angeles': [34.0522, -118.2437],
    'Chicago': [41.8781, -87.6298],
    'Houston': [29.7604, -95.3698],
    'Phoenix': [33.4484, -112.0740],
    'San Francisco': [37.7749, -122.4194],
    'Seattle': [47.6062, -122.3321],
    'Boston': [42.3601, -71.0589],
    'Miami': [25.7617, -80.1918],
    'Las Vegas': [36.1699, -115.1398],

    // UK
    'London': [51.5074, -0.1278],
    'Manchester': [53.4808, -2.2426],
    'Birmingham': [52.4862, -1.8904],
    'Glasgow': [55.8642, -4.2518],

    // France
    'Paris': [48.8566, 2.3522],
    'Lyon': [45.7640, 4.8357],
    'Marseille': [43.2965, 5.3698],

    // Germany
    'Berlin': [52.5200, 13.4050],
    'Munich': [48.1351, 11.5820],
    'Hamburg': [53.5511, 9.9937],

    // Spain
    'Madrid': [40.4168, -3.7038],
    'Barcelona': [41.3851, 2.1734],

    // Italy
    'Rome': [41.9028, 12.4964],
    'Milan': [45.4642, 9.1900],

    // Brazil
    'São Paulo': [-23.5505, -46.6333],
    'Rio de Janeiro': [-22.9068, -43.1729],
    'Brasília': [-15.8267, -47.9218],

    // Japan
    'Tokyo': [35.6762, 139.6503],
    'Osaka': [34.6937, 135.5023],

    // Australia
    'Sydney': [-33.8688, 151.2093],
    'Melbourne': [-37.8136, 144.9631],

    // Canada
    'Toronto': [43.6532, -79.3832],
    'Montreal': [45.5017, -73.5673],
    'Vancouver': [49.2827, -123.1207],

    // Mexico
    'Mexico City': [19.4326, -99.1332],

    // Argentina
    'Buenos Aires': [-34.6037, -58.3816],

    // Netherlands
    'Amsterdam': [52.3676, 4.9041],

    // Portugal
    'Lisbon': [38.7223, -9.1393],

    // Sweden
    'Stockholm': [59.3293, 18.0686],

    // Denmark
    'Copenhagen': [55.6761, 12.5683],
  };

  // Try to find exact city match
  if (cityCoordinates[city]) {
    return cityCoordinates[city];
  }

  // Country fallback (capitals or major cities)
  const countryDefaults = {
    'USA': [37.0902, -95.7129],
    'United States': [37.0902, -95.7129],
    'UK': [51.5074, -0.1278],
    'United Kingdom': [51.5074, -0.1278],
    'France': [48.8566, 2.3522],
    'Germany': [52.5200, 13.4050],
    'Spain': [40.4168, -3.7038],
    'Italy': [41.9028, 12.4964],
    'Brazil': [-23.5505, -46.6333],
    'Japan': [35.6762, 139.6503],
    'Australia': [-33.8688, 151.2093],
    'Canada': [43.6532, -79.3832],
    'Mexico': [19.4326, -99.1332],
    'Argentina': [-34.6037, -58.3816],
    'Netherlands': [52.3676, 4.9041],
    'Portugal': [38.7223, -9.1393],
    'Sweden': [59.3293, 18.0686],
    'Denmark': [55.6761, 12.5683],
  };

  return countryDefaults[country] || [0, 0];
};

export function MapView({ performances }) {
  const [mapReady, setMapReady] = useState(false);

  // Prepare map data with coordinates
  const mapData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return performances
      .map((performance) => {
        const coords = geocodeLocation(performance.city, performance.country);
        const eventDate = parseDate(performance.date);
        const isFuture = eventDate && eventDate >= today;

        return {
          ...performance,
          lat: coords[0],
          lng: coords[1],
          isFuture,
        };
      })
      .filter(p => p.lat !== 0 || p.lng !== 0); // Filter out ungeocoded locations
  }, [performances]);

  const positions = useMemo(
    () => mapData.map(p => [p.lat, p.lng]),
    [mapData]
  );

  // Default center (world view)
  const defaultCenter = [20, 0];
  const defaultZoom = 2;

  if (performances.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/60">No performances to display on map</p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] rounded-lg overflow-hidden border border-white/20 shadow-2xl">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .leaflet-popup-content-wrapper {
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0;
        }

        .leaflet-popup-content {
          margin: 0;
          width: 280px !important;
        }

        .leaflet-popup-tip {
          background: rgba(17, 24, 39, 0.95);
        }

        .custom-marker {
          background: transparent;
          border: none;
        }
      `}</style>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapReady && <MapBounds positions={positions} />}

        {mapData.map((performance, index) => (
          <Marker
            key={`${performance.id}-${index}`}
            position={[performance.lat, performance.lng]}
            icon={createCustomIcon(performance.isFuture)}
          >
            <Popup>
              <div className="p-4">
                {/* Header */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {performance.artistName}
                    </h3>
                    {performance.isFuture && (
                      <Badge className="bg-gradient-to-r from-cyan-500 to-emerald-500 border-cyan-300/30 text-xs shrink-0">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">{performance.venue}</p>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className={`w-4 h-4 ${performance.isFuture ? 'text-emerald-400' : 'text-blue-400'}`} />
                    <span className="text-sm">{performance.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className={`w-4 h-4 ${performance.isFuture ? 'text-cyan-400' : 'text-purple-400'}`} />
                    <span className="text-sm">
                      {performance.city}{performance.country ? `, ${performance.country}` : ''}
                    </span>
                  </div>

                  {performance.capacity > 0 && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Users className={`w-4 h-4 ${performance.isFuture ? 'text-teal-400' : 'text-pink-400'}`} />
                      <span className="text-sm">
                        Capacity: {performance.capacity.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action */}
                {performance.setlistUrl && (
                  <a
                    href={performance.setlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    View Details
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
