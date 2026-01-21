"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MagneticButton } from "@/components/magnetic-button";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-light">
            Welcome,{" "}
            <span className="text-emerald-500 font-medium">
              {session?.user?.name || "User"}
            </span>
          </h1>
          <MagneticButton variant="ghost" onClick={() => router.replace("/")}>
            Sign Out
          </MagneticButton>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 hover:border-emerald-500/30 transition-colors">
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-zinc-400 mb-4">
              You have 0 new anonymous messages.
            </p>
            <MagneticButton className="bg-emerald-600 hover:bg-emerald-500 text-white w-full rounded-full">
              View Messages
            </MagneticButton>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 hover:border-blue-500/30 transition-colors">
            <h3 className="text-xl font-medium mb-2">Share Link</h3>
            <p className="text-zinc-400 mb-4">
              Get more feedback by sharing your profile.
            </p>
            <MagneticButton
              variant="secondary"
              className="w-full rounded-full border border-zinc-700"
            >
              Copy Profile Link
            </MagneticButton>
          </div>
        </section>
      </div>
    </div>
  );
}
