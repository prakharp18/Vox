"use client";

import { Shader, Swirl, ChromaFlow } from "shaders/react";
import Link from "next/link";
import { GrainOverlay } from "@/components/grain-overlay";
import { MagneticButton } from "@/components/magnetic-button";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ArrowRight, Link as LinkIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const mockMessages = [
  {
    content: "delulu is the solulu until it actually works ngl",
    time: "2h ago",
    username: "manifesting_qt"
  },
  {
    content: "what's a conspiracy theory you actually believe in?",
    time: "35m ago",
    username: "tinfoil_hat_king"
  },
  {
    content: "academic weapon (i haven't started the assignment due in 1 hour)",
    time: "4h ago",
    username: "procrastinator_god"
  },
  {
    content: "if you could restart life with all your current memories, would you?",
    time: "15m ago",
    username: "existential_crisis_xo"
  },
  {
    content: "lowkey think my cat is judging my life choices rn",
    time: "1d ago",
    username: "cat_whisperer"
  },
  {
    content: "what's the pettiest reason you stopped talking to someone?",
    time: "5h ago",
    username: "drama_llama"
  },
  {
    content: "shipping myself with sleep immediately",
    time: "6h ago",
    username: "eepy_head"
  }
];

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [quickLink, setQuickLink] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const shaderContainerRef = useRef<HTMLDivElement>(null);

  const handleQuickNav = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!quickLink.trim()) return;

    setIsNavigating(true);
    
    let username = quickLink.trim();
    username = username.replace(/^(https?:\/\/)?(www\.)?[^\/]+\/u\//, "");
    username = username.replace(/^@/, "");
    username = username.replace(/\/$/, "");

    if (!username) {
        toast.error("Invalid link or username");
        setIsNavigating(false);
        return;
    }

    router.push(`/u/${username}`);
  };

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas");
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true);
          return true;
        }
      }
      return false;
    };

    if (checkShaderReady()) return;

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId);
      }
    }, 100);

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => {
      clearInterval(intervalId);
      clearTimeout(fallbackTimer);
    };
  }, []);

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
            speed={0.8}
            detail={0.4}
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
            momentum={25}
            maskType="alpha"
            opacity={0.9}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div
        className={`relative z-10 flex h-screen w-full flex-col items-center justify-center transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex flex-col items-center gap-6 text-center px-4 mb-12">
          <h1 className="font-sans text-7xl font-light tracking-tighter text-white md:text-9xl">
            VOX
          </h1>
          <p className="max-w-md text-lg text-slate-200 md:text-xl font-normal tracking-wide">
            The sound of anonymity. <br />
            Share your true thoughts, secretly.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/sign-up">
              <MagneticButton size="lg" variant="primary">
                Get Started
              </MagneticButton>
            </Link>
            <Link href="/sign-in">
              <MagneticButton size="lg" variant="ghost">
                Sign In
              </MagneticButton>
            </Link>
          </div>

          <form onSubmit={handleQuickNav} className="mt-8 relative w-full max-w-xs md:max-w-sm group">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <LinkIcon className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-300 transition-colors" />
             </div>
             <Input 
                placeholder="Got a link? Paste it here..." 
                className="pl-10 pr-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-400 hover:border-white/20 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/30 transition-all font-sans"
                value={quickLink}
                onChange={(e) => setQuickLink(e.target.value)}
                disabled={isNavigating}
             />
             <button 
                type="submit"
                disabled={!quickLink || isNavigating}
                className="absolute inset-y-1 right-1 aspect-square flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-0 disabled:pointer-events-none transition-all cursor-pointer"
             >
                {isNavigating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
             </button>
          </form>
        </div>

        <div className="w-full max-w-sm md:max-w-md px-4">
            <Carousel
                opts={{
                    loop: true,
                    align: "center",
                }}
                plugins={[
                    Autoplay({
                    delay: 5000,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent>
                    {mockMessages.map((msg, index) => (
                        <CarouselItem key={index} className="md:basis-1/1">
                            <div className="p-1">
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <span className="text-zinc-300 font-bold text-sm tracking-wide font-sans">@{msg.username}</span>
                                        <span className="text-xs font-sans font-medium bg-white/10 text-zinc-100 px-3 py-1.5 rounded-full backdrop-blur-md">
                                            {msg.time}
                                        </span>
                                    </div>
                                    <p className="text-white/90 text-xl font-light leading-relaxed tracking-wide font-sans relative z-10">
                                        "{msg.content}"
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
