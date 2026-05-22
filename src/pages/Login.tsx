import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  IUserLoginSchema,
  UserLoginSchema,
} from "@/features/auth/types/auth.interface";
import { loginUser } from "@/features/auth/store/auth.thunk";
const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserLoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(UserLoginSchema),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data: IUserLoginSchema) => {
    try {
      const response = await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
        }),
      ).unwrap();

      toast.success(response.message);

      navigate("/home");
    } catch (error) {
      if (
        error instanceof Object &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        if (error.message === "Account not verified") {
          toast("Your account is not verified", {
            description: "Please verify your email to login",
            action: {
              label: "Verify Now",
              onClick: () => {
                navigate(`/verify-email?email=${data.email}`);
              },
            },
          });
          return;
        }
        toast.error(error.message);
        return;
      }
      toast.error("Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-2xl font-bold">Login</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            style={{ display: "contents" }}
          >
            <div className="w-full space-y-2">
              <Label>Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="w-full space-y-2">
              <Label>Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
