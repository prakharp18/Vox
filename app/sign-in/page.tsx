"use client";

import { MagneticButton } from "@/components/magnetic-button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Shader, Swirl, ChromaFlow } from "shaders/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Login Failed", {
          description: result.error,
        });
      }

      if (result?.url) {
        toast.success("Welcome back!");
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
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
              colorA="#020024"
              colorB="#090979"
              speed={0.8}
              detail={0.3}
              blend={40}
              coarseX={20}
              coarseY={20}
              mediumX={20}
              mediumY={20}
              fineX={20}
              fineY={20}
            />
            <ChromaFlow
              baseColor="#000000"
              upColor="#0a0a23"
              downColor="#1a237e"
              leftColor="#0d47a1"
              rightColor="#311b92"
              intensity={0.6}
              radius={1.5}
              momentum={25}
              maskType="alpha"
              opacity={0.7}
            />
          </Shader>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none z-10">
            <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg leading-tight">
              Welcome Back to
              <br />
              Vox
            </h2>
            <p className="text-blue-100/90 text-lg font-light tracking-wide max-w-sm drop-shadow-md">
              Sign in to continue your secret conversations.
            </p>
          </div>
        </div>


        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative z-20">
          <h2 className="text-3xl font-medium text-center text-zinc-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-zinc-500 text-center mb-10">
            Please enter your details to sign in.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 ml-1">
                      Email or Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email or username"
                        {...field}
                        className="bg-zinc-50 border-zinc-200 focus:ring-blue-500/20 focus:border-blue-500 text-zinc-900 placeholder:text-zinc-400 h-12 rounded-full"
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
                          className="bg-zinc-50 border-zinc-200 focus:ring-blue-500/20 focus:border-blue-500 text-zinc-900 placeholder:text-zinc-400 h-12 pr-12 rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-900"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
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
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </MagneticButton>
              </div>
            </form>
          </Form>

          <p className="mt-10 text-center text-sm text-zinc-500">
            <Link
              href="/sign-up"
              className="text-zinc-900 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
