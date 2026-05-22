import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import React from "react";
import { resendVerificationEmail } from "@/features/auth/store/auth.thunk";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { toast } from "sonner";

const VerifyEmail = () => {
  const dispatch = useAppDispatch();
  const [timer, setTimer] = React.useState(60);
  const state = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  let email = null;
  const [searchParams] = useSearchParams();
  if (state.user) {
    email = state.user.email;
  } else {
    email = searchParams.get("email");
  }
  const intervalId = React.useRef<NodeJS.Timeout | null>(null);
  const handleClick = async () => {
    try {
      setTimeout(() => {
        setTimer(60);
      }, 1000);
      const response = await dispatch(
        resendVerificationEmail({ email: email ?? "" }),
      ).unwrap();

      toast.success(response.message);
    } catch (error) {
      if (
        error instanceof Object &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        toast.error(error.message);

        return;
      }
      toast.error("Error occurs while resending the verification email");
    }
  };
  React.useEffect(() => {
    dispatch(resendVerificationEmail({ email: email ?? "" })).unwrap();
    intervalId.current = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

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

            <p className="font-medium text-black break-all"></p>

            <p className="text-sm text-gray-500 mt-2">
              Please check your inbox and click the verification link to
              activate your account.
            </p>
          </div>

          <div className="w-full space-y-3">
            <Button
              className="w-full"
              onClick={() =>
                window.open(
                  "https://mail.google.com",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              Open Gmail
            </Button>

            <Button
              variant="outline"
              className={`w-full ${timer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleClick}
            >
              Resend Verification Email {timer > 0 && `${timer}s`}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Already verified?{" "}
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
