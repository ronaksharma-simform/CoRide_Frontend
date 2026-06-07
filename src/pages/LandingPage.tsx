import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Debounce helper to prevent hitting the API on every single keystroke
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function PlaceSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordinate, setCoordinate] = useState({});
  const debouncedQuery = useDebounce(query, 400);

  const fetchPlaces = useCallback(async (searchText) => {
    if (!searchText || searchText.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Fetching from OpenStreetMap's Nominatim free API
      console.log("Start");
      const response = await fetch(`/photon/api?q=${searchText}&limit=5`);
      const data = await response.json();
      console.log(data);
      setSuggestions(data.features);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaces(debouncedQuery);
  }, [debouncedQuery, fetchPlaces]);

  const handleSelect = (place) => {
    console.log(place);
    setCoordinate(place.geometry);
  };
  const createSuggestion = (place) => {
    const arr = [];
    if (place.properties.name) {
      arr.push(place.properties.name);
    }
    if (place.properties.city) {
      arr.push(place.properties.city);
    }
    if (place.properties.state) {
      arr.push(place.properties.state);
    }
    return arr.join(" , ");
  };
  return (
    <div style={{ position: "relative", width: "300px", margin: "20px auto" }}>
      <input
        type="text"
        placeholder="Search for a location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
      />

      {loading && <div style={{ padding: "5px" }}>Loading...</div>}

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            padding: 0,
            margin: 0,
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((place) => (
            <li
              key={Math.random()}
              onClick={() => handleSelect(place)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {createSuggestion(place)}
            </li>
          ))}
        </ul>
      )}

      <div>Cooridnates : {JSON.stringify(coordinate)}</div>
      <div className="h-[800px] w-full">
        <MapContainer
          center={[23.0225, 72.5714]}
          zoom={12}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* <MapClickHandler /> */}
        </MapContainer>{" "}
      </div>
    </div>
  );
}
