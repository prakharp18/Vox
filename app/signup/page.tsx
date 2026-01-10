"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Shader, Swirl, ChromaFlow } from "shaders/react"

export default function SignupPage() {
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
                            colorA="#001a00"
                            colorB="#064e3b"
                            speed={0.3}
                            detail={0.5}
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
                            upColor="#14532d"   // Green 900
                            downColor="#15803d" // Green 700
                            leftColor="#166534" // Green 800
                            rightColor="#10b981"
                            intensity={0.7}
                            radius={1.8}
                            momentum={12}
                            maskType="alpha"
                            opacity={0.8}
                        />
                    </Shader>
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none z-10">
                        <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg leading-tight">
                            Dive into the World of<br />Anonymous Feedback
                        </h2>
                        <p className="text-emerald-100/90 text-lg font-light tracking-wide max-w-sm drop-shadow-md">
                            Vox - Where your identity remains a secret.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative z-20">
                    <div className="flex justify-center mb-8">
                        <img src="/logo.png" alt="Vox Logo" className="w-12 h-12" />
                    </div>

                    <h2 className="text-3xl font-medium text-center text-zinc-900 mb-2">Get Started Now</h2>
                    <p className="text-zinc-500 text-center mb-10">Sign up to share your thoughts anonymously.</p>

                    <form className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full py-3 bg-transparent border-b border-zinc-200 outline-none focus:border-zinc-900 transition-colors text-zinc-900 placeholder:text-zinc-400"
                            />
                        </div>

                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full py-3 bg-transparent border-b border-zinc-200 outline-none focus:border-zinc-900 transition-colors text-zinc-900 placeholder:text-zinc-400"
                            />
                        </div>

                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full py-3 bg-transparent border-b border-zinc-200 outline-none focus:border-zinc-900 transition-colors text-zinc-900 placeholder:text-zinc-400"
                            />
                        </div>

                        <div className="pt-6">
                            <MagneticButton variant="primary" size="lg" className="w-full py-4 justify-center">
                                Sign Up
                            </MagneticButton>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-zinc-500">
                        Already have an account? <Link href="/login" className="text-zinc-900 font-medium hover:underline">Log In</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    )
}
