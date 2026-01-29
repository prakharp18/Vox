"use client";

import { MagneticButton } from "@/components/magnetic-button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, Suspense } from "react";
import { Loader2, Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";
import { Shader, Swirl, ChromaFlow } from "shaders/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiResponse } from "@/types/ApiResponse";

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .length(6, { message: "Code must be 6 digits" })
    .regex(/^\d+$/, { message: "Code must be numbers only" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam,
      code: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post<ApiResponse>("/api/reset-password", data);
      toast.success("Success!", {
        description: "Your password has been reset. Please sign in.",
      });
      router.push("/sign-in");
    } catch (error) {
      console.error("Reset password error:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "Failed to reset password";
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 ml-1">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="m@example.com"
                  {...field}
                  className="bg-zinc-50 border-zinc-200 focus:ring-purple-500/20 focus:border-purple-500 text-zinc-900 placeholder:text-zinc-400 h-12 rounded-full"
                />
              </FormControl>
              <FormMessage className="text-red-500 ml-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 ml-1">
                Verification Code
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="123456"
                  {...field}
                  maxLength={6}
                  className="bg-zinc-50 border-zinc-200 focus:ring-purple-500/20 focus:border-purple-500 text-zinc-900 placeholder:text-zinc-400 h-12 tracking-widest text-center rounded-full"
                />
              </FormControl>
              <FormMessage className="text-red-500 ml-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 ml-1">New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    className="bg-zinc-50 border-zinc-200 focus:ring-purple-500/20 focus:border-purple-500 text-zinc-900 placeholder:text-zinc-400 h-12 pr-12 rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-900"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 ml-1" />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <MagneticButton
            type="submit"
            className="w-full h-12 bg-zinc-900 text-white hover:bg-zinc-800 border-0 rounded-full font-medium flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </MagneticButton>
        </div>
      </form>
    </Form>
  );
}

export default function ResetPasswordPage() {
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
              colorA="#1a237e"
              colorB="#311b92"
              speed={0.6}
              detail={0.4}
              blend={50}
              coarseX={15}
              coarseY={15}
              mediumX={15}
              mediumY={15}
              fineX={15}
              fineY={15}
            />
            <ChromaFlow
              baseColor="#000000"
              upColor="#5e35b1"
              downColor="#4527a0"
              leftColor="#283593"
              rightColor="#512da8"
              intensity={0.5}
              radius={1.6}
              momentum={20}
              maskType="alpha"
              opacity={0.6}
            />
          </Shader>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none z-10">
            <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg leading-tight">
              Secure
              <br />
              New Start
            </h2>
            <p className="text-purple-100/90 text-lg font-light tracking-wide max-w-sm drop-shadow-md">
              Set a strong password to keep your secrets safe.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative z-20">
          <div className="mb-6">
            <Link
              href="/sign-in"
              className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Lock className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-3xl font-medium text-zinc-900">
                New Password
              </h2>
            </div>
            <p className="text-zinc-500">
              Enter your code and new password below.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Didn&apos;t receive the code?{" "}
            <Link
              href="/forgot-password"
              className="text-zinc-900 font-medium hover:underline"
            >
              Resend
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
