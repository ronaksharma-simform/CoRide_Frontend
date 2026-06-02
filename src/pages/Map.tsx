import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Polyline, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";

type Coordinate = {
  lat: number;
  lng: number;
};

const Map = () => {
  const mapRef = useRef(null);

  const [coords, setCoords] = useState<Coordinate[]>([]);
  const [route, setRoute] = useState<[number, number][]>([]);

  const latitude = 22.995529;
  const longitude = 72.501279;

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const point = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };

        setCoords((prev) => [...prev, point]);
      },
    });

    return null;
  }

  useEffect(() => {
    console.log("Selected Coordinates:", coords);
  }, [coords]);

  const handleSubmit = async () => {
    try {
      if (coords.length < 2) {
        alert("Please select source and destination");
        return;
      }

      const source = coords[0];
      const destination = coords[1];

      const url = `https://router.project-osrm.org/route/v1/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`;

      console.log("OSRM URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch route");
      }

      const data = await response.json();

      console.log("OSRM Response:", data);

      const coordinates = data.routes?.[0]?.geometry?.coordinates ?? [];

      const leafletCoordinates: [number, number][] = coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng],
      );

      setRoute(leafletCoordinates);
    } catch (error) {
      console.error("Route Error:", error);
    }
  };

  const clearMap = () => {
    setCoords([]);
    setRoute([]);
  };

  return (
    <>
      <div className="flex gap-2 p-2">
        <Button onClick={handleSubmit}>Generate Route</Button>

        <Button variant="destructive" onClick={clearMap}>
          Clear
        </Button>
      </div>

      <div className="h-screen w-screen">
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          ref={mapRef}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler />

          {/* User Selected Points */}
          <Polyline
            positions={coords.map((c) => [c.lat, c.lng])}
            pathOptions={{ color: "blue" }}
          />

          {/* OSRM Route */}
          {route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{ color: "red", weight: 5 }}
            />
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
