"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Lock,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Shader, Swirl, ChromaFlow } from "shaders/react";

const MagneticButton = ({
  children,
  className,
  onClick,
  disabled,
  type = "button",
  variant = "solid",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "solid" | "outline" | "ghost";
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.15);

    y.set(middleY * 0.15);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: mouseX, y: mouseY }}
      className={`relative overflow-hidden transition-colors ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default function SignUp() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameMessage("");
      }
    };
    checkUsernameUnique();
  }, [username]);

  const nextStep = async () => {
    const isValid = await form.trigger("username");

    if (isValid && usernameMessage === "Username is available") {
      setStep(2);
    } else if (usernameMessage !== "Username is available") {
      toast.error("Invalid Username", {
        description: "Please choose an available username first.",
      });
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success("Account Created!", {
        description: "We've sent a verification code to your email.",
      });
      setStep(3);
    } catch (error) {
      console.error("Sign up error:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      if (errorMessage.toLowerCase().includes("email")) {
        form.setError("email", { type: "manual", message: errorMessage });
      }

      toast.error("Sign Up Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerify = async () => {
    setIsVerifying(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: form.getValues("username"),
        code: verificationCode,
      });

      toast.success("Verified!", {
        description: "Welcome to Vox.",
      });

      router.replace("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "Verification failed";
      toast.error("Verification Error", { description: errorMessage });
    } finally {
      setIsVerifying(false);
    }
  };

  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleResend = async () => {
    try {
      await axios.post<ApiResponse>("/api/sign-up", form.getValues());
      toast.success("Code Resent", {
        description: "Please check your spam folder.",
      });
      setResendTimer(30);
    } catch (error) {
      toast.error("Failed to resend", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#121212] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[600px]"
      >
        <div className="hidden md:block w-1/2 relative overflow-hidden bg-black">
          <Shader className="h-full w-full absolute inset-0">
            <Swirl
              colorA="#001a00"
              colorB="#064e3b"
              speed={0.8}
              detail={0.3}
              blend={40}
              coarseX={20}
              coarseY={20}
              mediumX={20}
              mediumY={20}
              fineX={10}
              fineY={10}
            />
            <ChromaFlow
              baseColor="#000000"
              upColor="#14532d"
              downColor="#15803d"
              leftColor="#166534"
              rightColor="#10b981"
              intensity={0.7}
              radius={1.8}
              momentum={25}
              maskType="alpha"
              opacity={0.8}
            />
          </Shader>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none z-10">
            <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg leading-tight">
              Dive into the World of
              <br />
              Anonymous Feedback
            </h2>
            <p className="text-emerald-100/90 text-lg font-light tracking-wide max-w-sm drop-shadow-md">
              Vox - Where your identity remains a secret.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative z-20">
          <h2 className="text-3xl font-medium text-center text-zinc-900 mb-2">
            {step === 1
              ? "Get Started"
              : step === 2
                ? "Secure Account"
                : "Verify Email"}
          </h2>
          <p className="text-zinc-500 text-center mb-8">
            {step === 1
              ? "Pick a unique username to join Vox."
              : step === 2
                ? "Set up your email and password."
                : "Enter the code sent to your email."}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 ml-1">
                            Username
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="pizzat"
                                {...field}
                                className={`bg-zinc-50 border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 placeholder:text-zinc-400 pl-10 h-12 rounded-full`}
                                onChange={(e) => {
                                  field.onChange(e);
                                  debounced(e.target.value);
                                }}
                              />
                              <div className="absolute left-3 top-3.5 text-zinc-400 font-bold text-sm">
                                @
                              </div>

                              {isCheckingUsername && (
                                <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-zinc-400" />
                              )}
                              {!isCheckingUsername &&
                                usernameMessage === "Username is available" && (
                                  <Check className="absolute right-3 top-3.5 h-5 w-5 text-emerald-500" />
                                )}
                            </div>
                          </FormControl>

                          {!isCheckingUsername && usernameMessage && (
                            <p
                              className={`text-sm ml-1 ${usernameMessage === "Username is available" ? "text-emerald-500" : "text-red-500"}`}
                            >
                              {usernameMessage}
                            </p>
                          )}
                          <FormMessage className="text-red-500 ml-1" />
                        </FormItem>
                      )}
                    />

                    <MagneticButton
                      onClick={nextStep}
                      disabled={
                        isCheckingUsername ||
                        usernameMessage !== "Username is available"
                      }
                      className="w-full h-12 bg-zinc-900 text-white hover:bg-zinc-800 rounded-full font-medium"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </MagneticButton>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 ml-1">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="m@example.com"
                              {...field}
                              className="bg-zinc-50 border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 placeholder:text-zinc-400 h-12 rounded-full"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 ml-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 ml-1">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="bg-zinc-50 border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 placeholder:text-zinc-400 h-12 pr-12 rounded-full"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 h-10 w-10 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900 rounded-full"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 ml-1" />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1 h-12 border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-full"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <MagneticButton
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] h-12 bg-emerald-600 hover:bg-emerald-500 text-white border-0 rounded-full font-medium"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Sign Up"
                        )}
                      </MagneticButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <AnimatePresence mode="wait">
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 pt-2"
                >
                  <div className="flex justify-center">
                    <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                      <Lock className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-zinc-700 font-medium ml-1">
                        Verification Code
                      </label>
                      <Input
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="bg-zinc-50 border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 placeholder:text-zinc-400 h-12 text-center text-lg tracking-widest rounded-full"
                        maxLength={6}
                      />
                      <p className="text-xs text-zinc-500 ml-1 text-center">
                        Check your email{" "}
                        <strong>{form.getValues("email")}</strong> for the code.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="flex-1 h-12 border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-full"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <MagneticButton
                        onClick={onVerify}
                        disabled={isVerifying || verificationCode.length < 6}
                        className="flex-[2] h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify & Complete"
                        )}
                      </MagneticButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Form>

          <p className="mt-10 text-center text-sm text-zinc-500">
            {step !== 3 && (
              <>
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-zinc-900 font-medium hover:underline"
                >
                  Sign In
                </Link>
              </>
            )}
            {step === 3 && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`font-medium hover:underline transition-colors ${resendTimer > 0 ? "text-zinc-400 cursor-not-allowed" : "text-zinc-900"}`}
              >
                {resendTimer > 0
                  ? `Resend code in ${resendTimer}s`
                  : "Didn't receive code? Resend"}
              </button>
            )}
          </p>
        </div>
      </motion.div>
    </main>
  );
}
