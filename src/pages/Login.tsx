import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { registerUser } from "@/redux/auth.slice";
import { useAppDispatch } from "@/hooks/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await dispatch(
        registerUser({
          email: data.email,
          password: data.password,
        }),
      ).unwrap();
      console.log(response);
      await toast.success(response.message);

      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error(typeof error === "string" ? error : "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-2xl font-bold">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} method="POST">
            <div className="w-full space-y-2">
              <Label>Email</Label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email",
                  },
                }}
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
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                    message:
                      "Password must contain uppercase, lowercase, number and special character",
                  },
                }}
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
      {/* {
        selector.error && alertComponent()
      } */}
    </div>
  );
}
