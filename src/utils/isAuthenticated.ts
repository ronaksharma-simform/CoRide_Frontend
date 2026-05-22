import { useAppSelector } from "@/hooks/hooks";

const useisAuthenticated = (): boolean => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

export default useisAuthenticated;
