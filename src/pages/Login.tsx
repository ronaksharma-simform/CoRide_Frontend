import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm, Controller } from "react-hook-form";
export default function Login() {
  const { control } = useForm<{
    email: string;
    password: string;
  }>({});
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-2xl font-bold">Login</h1>

          <div className="w-full space-y-2">
            <Label>Email</Label>
            <Controller
              control={control}
              name="email"
              render={() => {
                <Input type="email" placeholder="Enter email" />;
              }}
            />
          </div>

          <div className="w-full space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Enter password" />
          </div>

          <Button className="w-full">Login</Button>
        </CardContent>
      </Card>
    </div>
  );
}
