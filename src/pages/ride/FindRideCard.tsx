import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock } from "lucide-react";
import { TRideFindDataSchema } from "@/features/ride/validations/ride.validations";

const MatchingRideCard = ({ ride }: { ride: TRideFindDataSchema }) => {
  // 1. Format the ISO Date to a readable string (e.g., "Jun 7, 02:54 AM")
  const formatDepartureTime = (isoString: Date) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 2. Format distance: meters to kilometers if > 1000m
  const formatDistance = (meters: number) => {
    if (!meters) return "Unknown distance";
    if (meters < 1000) {
      return `${Math.round(meters)} meters`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Extract variables safely with fallbacks in case relations aren't populated yet
  const formattedTime = formatDepartureTime(ride.departureTime);
  const formattedDistance = formatDistance(ride.distanceMeter);

  return (
    <Card className=" shadow-sm hover:shadow-md transition-all border-gray-200 overflow-hidden cursor-pointer group">
      <CardContent className="p-0">
        <div className="p-4 flex gap-4">
          {/* Driver Avatar & Rating */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <Avatar className="w-12 h-12 border-2 border-primary/10">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${ride.providerId}`}
              />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </div>

          {/* Ride Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                {/* Priority Indicator based on your schema */}
                {ride.priority && (
                  <Badge
                    variant="secondary"
                    className="mt-1 text-[10px] h-4 uppercase bg-blue-50 text-blue-600 border-none"
                  >
                    Optimized for {ride.priority}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="w-4 h-4 text-blue-500 mr-2" />
                <span className="font-semibold">{formattedTime}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-green-500 mr-2" />
                <span>
                  Pickup is{" "}
                  <span className="font-semibold text-gray-900">
                    {formattedDistance}
                  </span>{" "}
                  away
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="bg-gray-50 p-3 flex items-center justify-between border-t border-gray-100">
          <Badge variant="outline" className="bg-white">
            {ride.availableSeats} / {ride.totalSeats} seats left
          </Badge>
          <Button size="sm" className="shadow-sm group-hover:bg-primary/90">
            Request Seat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingRideCard;
