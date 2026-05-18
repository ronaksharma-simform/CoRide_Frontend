export interface IUser {
  username: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  gender: "MALE" | "FEMALE";
  avg_rating: number;
  total_rides: number;
  created_at: string;
}
export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
export interface LoginResponse {
  success: boolean;
  message: string;
  data: IUser;
  accessToken: string;
}
