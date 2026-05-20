import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import React from "react";

const VerifyEmail = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <MailCheck className="w-12 h-12 text-blue-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Verify Your Email</h1>

            <p className="text-gray-600 text-sm leading-relaxed">
              We have sent a verification link to
            </p>

            <p className="font-medium text-black break-all">{email}</p>

            <p className="text-sm text-gray-500 mt-2">
              Please check your inbox and click the verification link to
              activate your account.
            </p>
          </div>

          <div className="w-full space-y-3">
            <Button
              className="w-full"
              onClick={() => window.open("https://mail.google.com", "_blank")}
            >
              Open Gmail
            </Button>

            <Button variant="outline" className="w-full">
              Resend Verification Email
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Already verified?
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline ml-1"
            >
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
