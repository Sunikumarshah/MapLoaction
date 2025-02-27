import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom hook to update the map view
const SetMapView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
};

const MapLocation = () => {
  const [initialLocation, setInitialLocation] = useState({ lat: 23.2599, lng: 77.4126 }); // Default to Bhopal
  const [destinationLocation, setDestinationLocation] = useState({ lat: 22.7196, lng: 75.8577 }); // Default to Indore
  const [initialPlace, setInitialPlace] = useState('');
  const [destinationPlace, setDestinationPlace] = useState('');

  const getCoordinates = async (place) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      } else {
        alert('Location not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const handleInitialSearch = async () => {
    const coords = await getCoordinates(initialPlace);
    if (coords) {
      setInitialLocation(coords);
    }
  };

  const handleDestinationSearch = async () => {
    const coords = await getCoordinates(destinationPlace);
    if (coords) {
      setDestinationLocation(coords);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Enter initial location (e.g., Bhopal)"
          value={initialPlace}
          onChange={(e) => setInitialPlace(e.target.value)}
        />
        <button onClick={handleInitialSearch}>Search Initial Location</button>

        <input
          type="text"
          placeholder="Enter destination (e.g., Indore)"
          value={destinationPlace}
          onChange={(e) => setDestinationPlace(e.target.value)}
        />
        <button onClick={handleDestinationSearch}>Search Destination</button>
      </div>

      <MapContainer
        center={[initialLocation.lat, initialLocation.lng]}
        zoom={7}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[initialLocation.lat, initialLocation.lng]} />
        <Marker position={[destinationLocation.lat, destinationLocation.lng]} />
        <SetMapView coords={[initialLocation.lat, initialLocation.lng]} />
      </MapContainer>
    </div>
  );
};

export default MapLocation;
