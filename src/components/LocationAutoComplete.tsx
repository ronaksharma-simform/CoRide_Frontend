import React, { ComponentType, useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

// Minimal Photon feature type used by this component
type PhotonFeature = {
  properties: {
    name?: string;
    city?: string | null;
    state?: string | null;
    osm_id?: number | string | null;
  };
  geometry: { coordinates: [number, number] };
};

const LocationAutocomplete = ({
  placeholder,
  icon: Icon,
  iconColor,
  onSearchSelect,
}: {
  placeholder: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  onSearchSelect: (coords: { lat: number; lng: number }, name: string) => void;
}) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const fetchPlaces = useCallback(async (searchText: string) => {
    if (!searchText || searchText.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      console.log(":ss");
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${searchText}&limit=5`,
      );
      const data = await response.json();
      setSuggestions(data.features as PhotonFeature[]);
      console.log(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaces(debouncedQuery);
  }, [debouncedQuery, fetchPlaces]);

  const handleSelect = (place: PhotonFeature) => {
    const name = [
      place.properties.name,
      place.properties.city,
      place.properties.state,
    ]
      .filter(Boolean)
      .join(", ");
    setQuery(name);
    setIsOpen(false);
    const [lng, lat] = place.geometry.coordinates;
    onSearchSelect({ lat, lng }, name);
  };

  return (
    <div className="relative w-full z-100">
      <Icon
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor}`}
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        className="pl-9 bg-white"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
      )}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((place, idx) => (
            <li
              key={
                place.properties.osm_id ??
                `${place.properties.name}-${place.properties.city ?? ""}-${place.properties.state ?? ""}-${idx}`
              }
              className="z-100 px-4 py-2 border-b border-gray-100 last:border-0"
            >
              <button
                type="button"
                onClick={() => handleSelect(place)}
                className="z-100 w-full text-left hover:bg-gray-50 cursor-pointer text-sm"
              >
                {[
                  place.properties.name,
                  place.properties.city,
                  place.properties.state,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default LocationAutocomplete;
