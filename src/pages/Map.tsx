import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";

type Coordinate = {
  lat: number;
  lng: number;
};

const parseUrlWaypoints = (search: string): Coordinate[] => {
  const params = new URLSearchParams(search);
  const query = params.get("waypoints") || params.get("coords");

  if (!query) {
    return [];
  }

  return query
    .split(";")
    .map((item) => {
      const [latString, lngString] = item.split(",");

      const lat = Number(latString);
      const lng = Number(lngString);

      return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
    })
    .filter((point): point is Coordinate => point !== null);
};

const Map = () => {
  const mapRef = useRef(null);

  const [coords, setCoords] = useState<Coordinate[]>([]);
  const [route, setRoute] = useState<[number, number][]>([]);

  const latitude = 22.995529;
  const longitude = 72.501279;

  function MapClickHandler() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        setCoords((prev) => [
          ...prev,
          {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          },
        ]);
      },
    });

    return null;
  }

  const generateRoute = async (points: Coordinate[]) => {
    try {
      if (points.length < 2) {
        return;
      }

      const coordinateString = points
        .map((point) => `${point.lng},${point.lat}`)
        .join(";");

      const url =
        `https://router.project-osrm.org/route/v1/driving/${coordinateString}` +
        "?overview=full&geometries=geojson";

      console.log(url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch route");
      }

      const data = await response.json();

      const coordinates = data.routes?.[0]?.geometry?.coordinates ?? [];

      const leafletCoordinates = coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number],
      );

      setRoute(leafletCoordinates);
    } catch (error) {
      console.error("Route generation failed", error);
    }
  };

  useEffect(() => {
    const initialCoords = parseUrlWaypoints(window.location.search);

    if (initialCoords.length > 0) {
      setCoords(initialCoords);
    }
  }, []);

  useEffect(() => {
    if (coords.length >= 2) {
      generateRoute(coords);
    } else {
      setRoute([]);
    }
  }, [coords]);

  const clearMap = () => {
    setCoords([]);
    setRoute([]);
  };

  const removeLastPoint = () => {
    setCoords((prev) => prev.slice(0, -1));
  };

  return (
    <>
      <div className="flex gap-2 p-4">
        <Button onClick={() => generateRoute(coords)}>Generate Route</Button>

        <Button variant="outline" onClick={removeLastPoint}>
          Undo Last Point
        </Button>

        <Button variant="destructive" onClick={clearMap}>
          Clear
        </Button>
      </div>

      <div className="h-screen w-screen">
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          ref={mapRef}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler />

          {coords.map((point, index) => {
            let label = `Waypoint ${index}`;

            if (index === 0) {
              label = "Source";
            } else if (index === coords.length - 1) {
              label = "Destination";
            }

            return (
              <Marker key={index} position={[point.lat, point.lng]}>
                <Popup>
                  {label}
                  <br />
                  {point.lat.toFixed(6)},{point.lng.toFixed(6)}
                </Popup>
              </Marker>
            );
          })}

          {coords.length > 1 && (
            <Polyline
              positions={coords.map((point) => [point.lat, point.lng])}
              pathOptions={{
                color: "blue",
                weight: 2,
                dashArray: "5, 10",
              }}
            />
          )}

          {route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{
                color: "red",
                weight: 5,
              }}
            />
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
