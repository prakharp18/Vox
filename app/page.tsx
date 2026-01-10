"use client"

import { Shader, Swirl, ChromaFlow } from "shaders/react"
import Link from "next/link"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const shaderContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background text-foreground">
      <GrainOverlay />


      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#CC5500"
            colorB="#FFDB58"
            speed={0.5}
            detail={0.6}
            blend={60}
            coarseX={30}
            coarseY={30}
            mediumX={30}
            mediumY={30}
            fineX={30}
            fineY={30}
          />
          <ChromaFlow
            baseColor="#2c1a0e"
            upColor="#FF4500"
            downColor="#008080"
            leftColor="#CC5500"
            rightColor="#FFDB58"
            intensity={0.8}
            radius={2.0}
            momentum={20}
            maskType="alpha"
            opacity={0.9}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div
        className={`relative z-10 flex h-screen w-full items-center justify-center transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex flex-col items-center gap-6 text-center px-4">
          <h1 className="font-sans text-7xl font-light tracking-tighter text-white md:text-9xl flex items-center justify-center gap-0">
            V
            <img
              src="/logo.png"
              alt="Vox Logo"
              className="w-[1em] h-[1em] mx-[-0.05em] drop-shadow-2xl animate-pulse scale-110"
              style={{ filter: "invert(1)" }}
            />
            X
          </h1>
          <p className="max-w-md text-lg text-slate-300 md:text-xl font-light tracking-wide">
            The sound of anonymity. <br />
            Share your true thoughts, secretly.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/signup">
              <MagneticButton size="lg" variant="primary">
                Get Started
              </MagneticButton>
            </Link>
            <Link href="/login">
              <MagneticButton size="lg" variant="ghost">
                Login
              </MagneticButton>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
