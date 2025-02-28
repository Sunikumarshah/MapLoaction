import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getDistance } from 'geolib'; // For distance calculation

// Custom hook to update the map view
const SetMapView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
};

const MapLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState({ lat: 22.7196, lng: 75.8577 }); // Default to Indore
  const [distance, setDistance] = useState(null);
  const [currentLocationSearch, setCurrentLocationSearch] = useState('');
  const [destinationLocationSearch, setDestinationLocationSearch] = useState('');

  // Function to fetch coordinates from a location name using Nominatim (OpenStreetMap's geocoding API)
  const fetchCoordinates = async (locationName, setLocation) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      alert('Error fetching coordinates. Please try again later.');
    }
  };

  // Use Geolocation API to get the current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
          alert('Unable to fetch your location');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  // Calculate distance when both current and destination locations are available
  useEffect(() => {
    if (currentLocation) {
      const dist = getDistance(
        { latitude: currentLocation.lat, longitude: currentLocation.lng },
        { latitude: destinationLocation.lat, longitude: destinationLocation.lng }
      );
      setDistance((dist / 1000).toFixed(2)); // Convert to kilometers and round off
    }
  }, [currentLocation, destinationLocation]);

  // Handle search for current location
  const handleCurrentLocationSearch = () => {
    fetchCoordinates(currentLocationSearch, setCurrentLocation);
  };

  // Handle search for destination location
  const handleDestinationLocationSearch = () => {
    fetchCoordinates(destinationLocationSearch, setDestinationLocation);
  };

  return (
    <div>
      <h3>Map with Current Location and Destination Search</h3>
      <div style={{ marginBottom: '10px' }}>
        {distance && <p>Distance to destination: {distance} km</p>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        {/* Search Input for Current Location */}
        <input
          type="text"
          placeholder="Search current location"
          value={currentLocationSearch}
          onChange={(e) => setCurrentLocationSearch(e.target.value)}
        />
        <button onClick={handleCurrentLocationSearch}>Search Current Location</button>

        {/* Search Input for Destination Location */}
        <input
          type="text"
          placeholder="Search destination location"
          value={destinationLocationSearch}
          onChange={(e) => setDestinationLocationSearch(e.target.value)}
        />
        <button onClick={handleDestinationLocationSearch}>Search Destination</button>
      </div>

      {currentLocation && (
        <MapContainer
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={7}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Markers for current and destination locations */}
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <SetMapView coords={[currentLocation.lat, currentLocation.lng]} />
          </Marker>
          <Marker position={[destinationLocation.lat, destinationLocation.lng]} />
        </MapContainer>
      )}
    </div>
  );
};

export default MapLocation;
