import React, {
  useState,
  useEffect,
  useCallback,
  type ComponentType,
} from "react";
import {
  useForm,
  Controller,
  type Resolver,
  type SubmitHandler,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Navigation,
  CalendarClock,
  Settings2,
  Search,
  Loader2,
  ArrowLeft,
  MousePointerClick,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAppDispatch } from "@/hooks/hooks";
import { findRide } from "@/features/findRide/store/findRide.slice";
import { TRideFindDataSchema } from "@/features/ride/validations/ride.validations";
import MatchingRideCard from "./FindRideCard";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- 1. Zod Schema ---
const coordinateSchema = z.object({
  lat: z.number({ error: "Please select an exact location" }),
  lng: z.number({ error: "Please select an exact location" }),
});

export const findRideSchema = z.object({
  source: coordinateSchema,
  destination: coordinateSchema,
  seats: z.number().int("Seat number must be an integer").min(1).max(10),
  priority: z.enum(["TIME", "DISTANCE"]).default("TIME"),
  departureTime: z.coerce.date().refine((date) => date > new Date(), {
    message: "Departure must be in the future",
  }),
  maxTimeWindowHours: z
    .number()
    .min(0.1, "Minimum window is 0.1 hrs")
    .max(24)
    .default(1.0),
  maxWalkingDistanceMeters: z.number().int().min(100).max(10000).default(1000),
});

type FindRideFormValues = z.infer<typeof findRideSchema>;

type PhotonFeature = {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    osm_id?: number | string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

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
  const [query, setQuery] = useState("");
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
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${searchText}&limit=5`,
      );
      const data = await response.json();
      setSuggestions(data.features as PhotonFeature[]);
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
    <div className="relative w-full">
      <Icon
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor}`}
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
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
              className="px-4 py-2 border-b border-gray-100 last:border-0"
            >
              <button
                type="button"
                onClick={() => handleSelect(place)}
                className="w-full text-left hover:bg-gray-50 cursor-pointer text-sm"
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

const MapController = ({
  mapCenter,
  activeSelection,
  setValue,
}: {
  mapCenter: { lat: number; lng: number } | null;
  activeSelection: "source" | "destination" | null;
  setValue: UseFormSetValue<FindRideFormValues>;
}) => {
  const map = useMap();

  // Pan to searched location
  useEffect(() => {
    if (mapCenter) map.flyTo([mapCenter.lat, mapCenter.lng], 14);
  }, [mapCenter, map]);

  // Handle Clicks to set coordinates freely
  useMapEvents({
    click(e) {
      if (activeSelection === "source") {
        setValue(
          "source",
          { lat: e.latlng.lat, lng: e.latlng.lng },
          { shouldValidate: true },
        );
      } else if (activeSelection === "destination") {
        setValue(
          "destination",
          { lat: e.latlng.lat, lng: e.latlng.lng },
          { shouldValidate: true },
        );
      }
    },
  });
  return null;
};

// --- 5. Main Dashboard Component ---
export default function FindRideDashboard() {
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [matchRides, setMatchRides] = useState<TRideFindDataSchema[]>([]);
  const dispatch = useAppDispatch();
  // Map UX State
  const [activeSelection, setActiveSelection] = useState<
    "source" | "destination" | null
  >("source");
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FindRideFormValues>({
    resolver: zodResolver(findRideSchema) as Resolver<FindRideFormValues>,
    defaultValues: {
      seats: 1,
      priority: "TIME",
      maxTimeWindowHours: 1.0,
      maxWalkingDistanceMeters: 1000,
    },
  });

  const watchSource = watch("source");
  const watchDestination = watch("destination");
  const watchSeats = watch("seats");

  const onSubmit: SubmitHandler<FindRideFormValues> = async (data) => {
    console.log("Validated Form Data Submitted:", data);
    setIsLoading(true);
    const response = await dispatch(findRide(data)).unwrap();
    console.log("Find Ride Response:", response);
    setIsLoading(false);
    setIsShowingResults(true);
    setMatchRides(response.data);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50/50 p-6 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {!isShowingResults ? (
          <>
            <div className="lg:col-span-5 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="shrink-0 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Find a Ride
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Search an area, then click the map to tweak the pin.
                  </p>
                </div>

                {/* Form container with min-h-0 to allow scrolling */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <Card className="shadow-sm border-gray-200 flex-1 flex flex-col min-h-0">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                      {/* Location Selectors */}
                      <div className="space-y-4">
                        {/* ORIGIN */}
                        <div
                          className={`p-3 rounded-xl border-2 transition-all ${activeSelection === "source" ? "border-blue-500 bg-blue-50" : "border-transparent"}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-xs font-semibold uppercase text-gray-500">
                              1. Origin
                            </Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-blue-600"
                              onClick={() => setActiveSelection("source")}
                            >
                              <MousePointerClick className="w-3 h-3 mr-1" />{" "}
                              {watchSource?.lat
                                ? "Adjust Pin"
                                : "Select on Map"}
                            </Button>
                          </div>
                          <LocationAutocomplete
                            placeholder="Search city/area..."
                            icon={MapPin}
                            iconColor="text-blue-500"
                            onSearchSelect={(coords) => {
                              setMapCenter(coords);
                              setValue("source", coords, {
                                shouldValidate: true,
                              });
                              setActiveSelection("source");
                            }}
                          />
                          {errors.source && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.source.lat?.message}
                            </p>
                          )}
                        </div>

                        {/* DESTINATION */}
                        <div
                          className={`p-3 rounded-xl border-2 transition-all ${activeSelection === "destination" ? "border-red-500 bg-red-50" : "border-transparent"}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-xs font-semibold uppercase text-gray-500">
                              2. Destination
                            </Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-red-600"
                              onClick={() => setActiveSelection("destination")}
                            >
                              <MousePointerClick className="w-3 h-3 mr-1" />{" "}
                              {watchDestination?.lat
                                ? "Adjust Pin"
                                : "Select on Map"}
                            </Button>
                          </div>
                          <LocationAutocomplete
                            placeholder="Search city/area..."
                            icon={Navigation}
                            iconColor="text-red-500"
                            onSearchSelect={(coords) => {
                              setMapCenter(coords);
                              setValue("destination", coords, {
                                shouldValidate: true,
                              });
                              setActiveSelection("destination");
                            }}
                          />
                          {errors.destination && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.destination.lat?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <hr className="border-gray-100" />

                      {/* Time & Seats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold uppercase text-gray-500 ml-1">
                            Departure
                          </Label>
                          <div className="relative">
                            <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <Input
                              type="datetime-local"
                              {...register("departureTime")}
                              className="pl-9 bg-white"
                            />
                          </div>
                          {errors.departureTime && (
                            <p className="text-red-500 text-xs">
                              {errors.departureTime.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold uppercase text-gray-500 ml-1">
                            Seats
                          </Label>
                          <div className="flex items-center h-10 border border-input rounded-md bg-white">
                            <Button
                              type="button"
                              variant="ghost"
                              className="px-3"
                              onClick={() =>
                                setValue("seats", Math.max(1, watchSeats - 1))
                              }
                            >
                              -
                            </Button>
                            <div className="flex-1 text-center font-medium">
                              {watchSeats}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              className="px-3"
                              onClick={() =>
                                setValue("seats", Math.min(10, watchSeats + 1))
                              }
                            >
                              +
                            </Button>
                          </div>
                          {errors.seats && (
                            <p className="text-red-500 text-xs">
                              {errors.seats.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Advanced Match Rules */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                          <Settings2 className="w-4 h-4 text-primary" />{" "}
                          Advanced Filters
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">
                              Priority
                            </Label>
                            <Controller
                              control={control}
                              name="priority"
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="TIME">
                                      Fastest Time
                                    </SelectItem>
                                    <SelectItem value="DISTANCE">
                                      Shortest Distance
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">
                              Max Wait (Hours)
                            </Label>
                            <Input
                              type="number"
                              step="0.1"
                              {...register("maxTimeWindowHours", {
                                valueAsNumber: true,
                              })}
                              className="bg-white"
                            />
                            {errors.maxTimeWindowHours && (
                              <p className="text-red-500 text-xs">
                                {errors.maxTimeWindowHours.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5 md:col-span-2">
                            <Label className="text-xs text-gray-500">
                              Max Walking Distance (Meters)
                            </Label>
                            <Input
                              type="number"
                              {...register("maxWalkingDistanceMeters", {
                                valueAsNumber: true,
                              })}
                              className="bg-white"
                            />
                            {errors.maxWalkingDistanceMeters && (
                              <p className="text-red-500 text-xs">
                                {errors.maxWalkingDistanceMeters.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pinned Footer (Will always be visible at the bottom) */}
                    <CardFooter className="shrink-0 p-6 pt-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                      <Button
                        type="submit"
                        className="w-full text-lg h-12 shadow-md"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Search className="w-5 h-5 mr-2" /> Search Rides
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-7 flex-col h-[600px] lg:h-full pb-6 z-0">
              <Card className="w-full h-full shadow-sm border-gray-200 overflow-hidden relative rounded-2xl">
                {/* Map Instruction Overlay */}
                {!isShowingResults && activeSelection && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                    <div
                      className={`px-4 py-2 rounded-full shadow-lg font-bold text-white flex items-center gap-2 ${activeSelection === "source" ? "bg-blue-600" : "bg-red-600"}`}
                    >
                      <MousePointerClick className="w-5 h-5 animate-bounce" />
                      Click to adjust{" "}
                      {activeSelection === "source"
                        ? "Origin"
                        : "Destination"}{" "}
                      pin
                    </div>
                  </div>
                )}

                <MapContainer
                  center={[23.0225, 72.5714]}
                  zoom={12}
                  style={{
                    height: "100%",
                    width: "100%",
                    zIndex: 0,
                    cursor: activeSelection ? "crosshair" : "grab",
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <MapController
                    mapCenter={mapCenter}
                    activeSelection={activeSelection}
                    setValue={setValue}
                  />

                  {/* Render Pins dynamically */}
                  {watchSource?.lat && (
                    <Marker position={[watchSource.lat, watchSource.lng]}>
                      <Popup>Origin</Popup>
                    </Marker>
                  )}
                  {watchDestination?.lat && (
                    <Marker
                      position={[watchDestination.lat, watchDestination.lng]}
                    >
                      <Popup>Destination</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </Card>
            </div>
          </>
        ) : (
          <div className="lg:col-span-12 flex-1 flex flex-col h-full min-h-0">
            {/* Sticky Header area */}
            <div className="shrink-0 mb-4 ">
              <Button
                variant="ghost"
                onClick={() => setIsShowingResults(false)}
                className="-ml-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Edit Search
              </Button>
              <h2 className="text-xl font-bold mt-2 text-gray-900">
                Available Rides ({matchRides.length})
              </h2>
            </div>

            {/* Scrollable List Container (Column-wise grid) */}
            <div className=" flex-row overflow-y-auto custom-scrollbar pr-2 pb-10">
              {matchRides.length > 0 ? (
                matchRides.map((ride) => (
                  <MatchingRideCard
                    key={ride.id} // ALWAYS use the unique ID, never Math.random()
                    ride={ride}
                    // onBook={(id) => console.log("Book ride:", id)}
                  />
                ))
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                  <p className="text-gray-500">
                    No rides found for this route.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
