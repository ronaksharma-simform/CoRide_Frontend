import { useAppSelector } from "@/hooks/hooks";

const isAuthenticated = (): boolean => {
  const state = useAppSelector((state) => state.auth);
  const isAuthenticated = state.isAuthenticated;
  return isAuthenticated;
};
export default isAuthenticated;
