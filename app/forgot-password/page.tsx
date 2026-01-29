"use client";

import { MagneticButton } from "@/components/magnetic-button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Shader, Swirl, ChromaFlow } from "shaders/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/forgot-password",
        data,
      );
      toast.success("Code Sent", {
        description: "Check your email for the reset code.",
      });
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      
      if (axiosError.response?.status === 404) {
        router.replace("/user-not-found-error"); 
        return;
      }

      let errorMessage = "Failed to send code";
      
      if (axiosError.response) {
        errorMessage = axiosError.response.data.message || axiosError.message;
      } else if (axiosError.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = "An unexpected error occurred.";
      }

      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
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
              colorA="#2c003e"
              colorB="#512da8"
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
              upColor="#4a148c"
              downColor="#311b92"
              leftColor="#1a237e"
              rightColor="#4a148c"
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
              Recovery
              <br />
              Mode
            </h2>
            <p className="text-purple-100/90 text-lg font-light tracking-wide max-w-sm drop-shadow-md">
              Don&apos;t worry, it happens to the best of us.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative z-20">
          <div className="mb-8">
            <Link
              href="/sign-in"
              className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
            </Link>
            <h2 className="text-3xl font-medium text-zinc-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-zinc-500">
              Enter your email to receive a 6-digit reset code.
            </p>
          </div>

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

              <div className="pt-2">
                <MagneticButton
                  type="submit"
                  className="w-full h-12 bg-zinc-900 text-white hover:bg-zinc-800 border-0 rounded-full font-medium flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </MagneticButton>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </main>
  );
}
