import { z } from "zod";

export const cooridinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
type TRideDataSchema = {
  id: string;
  providerId: string;
  vehicleId: string;
  sourceLabel: { lat: number; lng: number };
  destinationLabel: { lat: number; lng: number };
  route: { lat: number; lng: number }[];
  departureTime: Date;
  totalSeats: number;
  availableSeats: number;
  status: "ACTIVE" | "FULL" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
};

export const CoordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const RideFormSchema = z.object({
  vehicleId: z.string().uuid("Vehicle Id is required"),

  sourceLabel: CoordinateSchema.optional(),

  destinationLabel: CoordinateSchema.optional(),

  route: z.array(CoordinateSchema).default([]),

  departureTime: z.coerce.date().refine((date) => date > new Date(), {
    message: "Departure must be in the future",
  }),

  totalSeats: z.coerce
    .number()
    .int("Seat number must be an integer")
    .min(1, "Seat Capacity must be at least 1")
    .max(10, "Seat capacity cannot exceed 10"),

  availableSeats: z.coerce
    .number()
    .int("Seat number must be an integer")
    .min(0, "Available seats cannot be negative")
    .max(10, "Available seats cannot exceed 10"),

  status: z
    .enum(["ACTIVE", "FULL", "COMPLETED", "CANCELLED"])
    .default("ACTIVE"),
});

export type TRideForm = z.infer<typeof RideFormSchema>;
export type TRideFormInput = z.input<typeof RideFormSchema>;
export const RideUpdateData = z.object({
  id: z.string(),
  data: RideFormSchema.omit({ vehicleId: true }).partial(),
});
export interface IRideResponseSchema {
  success: boolean;
  message: string;
  data: TRideDataSchema;
}
export interface IUserRideResponseSchema {
  success: boolean;
  message: string;
  data: TRideDataSchema[];
}
export const RideUpdateSchema = RideFormSchema.omit({
  vehicleId: true,
}).partial();
type TRideUpdateSchema = z.infer<typeof RideUpdateSchema>;
export type TRideUpdateInput = z.input<typeof RideUpdateSchema>;
type TRideUpdateData = z.infer<typeof RideUpdateData>;
type TRide = z.infer<typeof RideFormSchema>;
export { TRide, TRideUpdateSchema, TRideUpdateData, TRideDataSchema };
export interface IRideDeleteReponseSchema {
  success: boolean;
  message: string;
}
