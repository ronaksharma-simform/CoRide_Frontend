import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import simplify from "simplify-js";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";
export type Coordinate = {
  lat: number;
  lng: number;
};

interface RouteSelectorMapProps {
  onRouteSelected: (data: {
    sourceLabel: Coordinate;
    destinationLabel: Coordinate;
    route: Coordinate[];
  }) => void;
}

const RouteSelectorMap = ({ onRouteSelected }: RouteSelectorMapProps) => {
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [route, setRoute] = useState<[number, number][]>([]);

  function MapClickHandler() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        setPoints((prev) => [
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

  const generateRoute = async () => {
    if (points.length < 2) return;

    const coordinateString = points
      .map((point) => `${point.lng},${point.lat}`)
      .join(";");

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinateString}?overview=full&geometries=geojson`,
    );

    const data = await response.json();

    const coordinates = data.routes?.[0]?.geometry?.coordinates ?? [];

    const leafletCoordinates = coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number],
    );

    setRoute(leafletCoordinates);
  };

  const saveRoute = () => {
    if (points.length < 2 || route.length === 0) return;

    const simplifyInput = route.map((point) => ({
      x: point[0],
      y: point[1],
    }));

    const simplified = simplify(simplifyInput, 0.0001, true);

    const simplifiedRoute: Coordinate[] = simplified.map((point) => ({
      lat: point.x,
      lng: point.y,
    }));
    onRouteSelected({
      sourceLabel: points[0],
      destinationLabel: points[points.length - 1],
      route: simplifiedRoute,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={generateRoute}>Generate Route</Button>

        <Button
          variant="secondary"
          onClick={() => setPoints((prev) => prev.slice(0, -1))}
        >
          Undo
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            setPoints([]);
            setRoute([]);
          }}
        >
          Clear
        </Button>

        <Button onClick={saveRoute}>Save Route</Button>
      </div>

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

          <MapClickHandler />

          {points.map((point, index) => (
            <Marker
              key={`${point.lat}-${point.lng}`}
              position={[point.lat, point.lng]}
            >
              <Popup>
                {index === 0
                  ? "Source"
                  : index === points.length - 1
                    ? "Destination"
                    : `Waypoint ${index}`}
              </Popup>
            </Marker>
          ))}

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
    </div>
  );
};

export default RouteSelectorMap;
