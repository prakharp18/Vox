import Link from "next/link";
import { GrainOverlay } from "@/components/grain-overlay";
import { MagneticButton } from "@/components/magnetic-button";
import { ArrowLeft, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050505] font-sans text-white">
      <GrainOverlay />
      
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-80" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping rounded-full bg-zinc-500/20 duration-1000" />
            <div className="relative flex items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800 p-6">
                <Radio className="h-10 w-10 text-zinc-400" />
            </div>
        </div>
        
        <h1 className="mb-2 text-5xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 sm:text-7xl md:text-8xl">
            404
        </h1>
        <h2 className="mb-6 text-xl tracking-tight text-zinc-400 font-light">
            SIGNAL_LOST
        </h2>
        
        <p className="mb-10 max-w-sm text-sm leading-relaxed text-zinc-500">
          The frequency you are trying to reach does not exist or has been scrambled. 
          Please check your coordinates.
        </p>

        <Link href="/">
          <MagneticButton
            variant="primary"
            size="lg"
            className="group flex items-center gap-2 pl-4 pr-6"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to Signal
          </MagneticButton>
        </Link>
      </div>
      
       <div className="absolute bottom-8 flex gap-2">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-zinc-800 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
      </div>
    </main>
  );
}
