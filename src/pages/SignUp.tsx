import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import React from "react";

import { useForm, Controller } from "react-hook-form";

import {
  IUserRegistrationSchema,
  UserRegistrationSchema,
} from "@/features/auth/types/auth.interface";

import { useAppDispatch } from "@/hooks/hooks";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { registerUser } from "@/features/auth/store/auth.thunk";

import { zodResolver } from "@hookform/resolvers/zod";

const SignUp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      username: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      orgName: "",
      gender: "MALE",
    },
  });

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onSubmit = async (data: IUserRegistrationSchema) => {
    try {
      const response = await dispatch(registerUser(data)).unwrap();

      toast.success(response.message);

      navigate("/verify-email");
    } catch (error) {
      if (
        error instanceof Object &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        toast.error(error.message);

        return;
      }

      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}

            <div className="space-y-2">
              <Label>Username</Label>

              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter username" {...field} />
                )}
              />

              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* First Name */}

            <div className="space-y-2">
              <Label>First Name</Label>

              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter first name" {...field} />
                )}
              />

              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Middle Name */}

            <div className="space-y-2">
              <Label>Middle Name</Label>

              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter middle name"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Last Name */}

            <div className="space-y-2">
              <Label>Last Name</Label>

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter last name" {...field} />
                )}
              />

              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}

            <div className="space-y-2">
              <Label>Email</Label>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input type="email" placeholder="Enter email" {...field} />
                )}
              />

              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}

            <div className="space-y-2">
              <Label>Phone</Label>

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter phone number" {...field} />
                )}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Organization */}

            <div className="space-y-2">
              <Label>Organization Name</Label>

              <Controller
                name="orgName"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter organization name" {...field} />
                )}
              />

              {errors.orgName && (
                <p className="text-red-500 text-sm">{errors.orgName.message}</p>
              )}
            </div>

            {/* Password */}

            <div className="space-y-2">
              <Label>Password</Label>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    placeholder="Enter password"
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

            {/* Gender */}

            <div className="space-y-2">
              <Label>Gender</Label>

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full border rounded-md p-2">
                    <option value="MALE">MALE</option>

                    <option value="FEMALE">FEMALE</option>
                  </select>
                )}
              />

              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>

            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
