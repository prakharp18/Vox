"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Shader, Swirl, ChromaFlow } from "shaders/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        try {
            const result = await signIn("credentials", {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            })

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    toast.error("Login Failed", {
                        description: "Incorrect username or password",
                    })
                } else {
                    toast.error("Error", {
                        description: result.error,
                    })
                }
            }

            if (result?.url) {
                toast.success("Welcome back!")
                router.replace("/dashboard")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen w-full bg-[#121212] flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[600px]"
            >
                <div className="hidden md:block w-1/2 relative overflow-hidden bg-black">
                    <Shader className="h-full w-full absolute inset-0">
                        <Swirl
                            colorA="#020024"
                            colorB="#090979"
                            speed={0.3}
                            detail={0.4}
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
                            momentum={10}
                            maskType="alpha"
                            opacity={0.7}
                        />
                    </Shader>
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none z-10">
                        <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg">
                            Welcome Back to<br />Vox
                        </h2>
                        <p className="text-blue-100/90 text-lg font-light tracking-wide max-w-sm drop-shadow-md">
                            Sign in to continue your secret conversations.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative z-20">
                    <div className="flex justify-center mb-8">
                        <img src="/logo.png" alt="Vox Logo" className="w-12 h-12" />
                    </div>

                    <h2 className="text-3xl font-medium text-center text-zinc-900 mb-2">Welcome Back</h2>
                    <p className="text-zinc-500 text-center mb-10">Please enter your details to sign in.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="relative group">
                            <input
                                {...register("identifier")}
                                type="text"
                                placeholder="Email/Username"
                                className={`w-full py-3 bg-transparent border-b ${errors.identifier ? "border-red-500" : "border-zinc-200"} outline-none focus:border-zinc-900 transition-colors text-zinc-900 placeholder:text-zinc-400`}
                            />
                            {errors.identifier && (
                                <p className="text-xs text-red-500 mt-1">{errors.identifier.message}</p>
                            )}
                        </div>

                        <div className="relative group">
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className={`w-full py-3 bg-transparent border-b ${errors.password ? "border-red-500" : "border-zinc-200"} outline-none focus:border-zinc-900 transition-colors text-zinc-900 placeholder:text-zinc-400`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="pt-6 space-y-4">
                            <MagneticButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full py-4 justify-center"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </MagneticButton>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-zinc-500">
                        <Link href="/sign-up" className="text-zinc-900 font-medium hover:underline">Create an account</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    )
}
