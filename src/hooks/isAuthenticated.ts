import { useAppSelector } from "@/hooks/hooks";

const useIsAuthenticated = (): boolean => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

export default useIsAuthenticated;
