import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

import { getCurrentUser } from "@/features/auth/store/auth.thunk";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const getUserDetails = async () => {
    const data = await dispatch(getCurrentUser());
    //    const e = useAppSelector((state)=>state.auth);

    console.log(data);
  };
  useEffect(() => {
    getUserDetails().then(() => {
      console.log(auth);
    });
    console.log(auth);
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
