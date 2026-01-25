"use client";

import { useEffect } from "react";
import { GrainOverlay } from "@/components/grain-overlay";
import { MagneticButton } from "@/components/magnetic-button";
import { RefreshCcw, AlertTriangle, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050505] font-sans text-white">
      <GrainOverlay />
      
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <div className="mb-6 flex items-center justify-center rounded-full bg-red-500/10 p-6 ring-1 ring-red-500/50">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        
        <h1 className="mb-2 text-4xl font-light tracking-tighter sm:text-6xl md:text-7xl">
          SYSTEM_FAILURE
        </h1>
        
        <div className="mb-8 flex max-w-md flex-col gap-2 rounded-lg border border-red-500/20 bg-red-950/10 p-4 font-mono text-xs text-red-400/80 backdrop-blur-md">
            <p className="border-b border-red-500/20 pb-2 uppercase tracking-wider">Error Diagnostics</p>
            <p className="break-all">{error.message || "Unknown error occurred"}</p>
            {error.digest && <p className="text-[10px] opacity-50">Digest: {error.digest}</p>}
        </div>

        <div className="flex gap-4">
             <MagneticButton
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 hover:shadow-[0_0_2rem_rgba(220,38,38,0.4)]"
             >
                <LogOut className="h-4 w-4" />
                Force Sign Out
             </MagneticButton>
             

        </div>
      </div>

      <div className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-zinc-700">
        Vox_System_Monitor_v0.9
      </div>
    </main>
  );
}
