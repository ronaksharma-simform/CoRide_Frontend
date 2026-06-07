import { TRideFindDataSchema } from "@/features/ride/validations/ride.validations";

export interface IFindRideResponseSchema {
  success: boolean;
  message: string;
  data: TRideFindDataSchema[];
}
