"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardWindowProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export function DashboardWindow({
  children,
  className,
  title,
  icon,
}: DashboardWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative group overflow-hidden flex flex-col rounded-[2rem]",
        "bg-zinc-950 border border-zinc-800/50", 
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
          {icon && <span className="text-zinc-400">{icon}</span>}
          <h3 className="text-sm font-medium text-zinc-200 tracking-wide uppercase">
            {title}
          </h3>
        </div>
      )}
      
      <div className="flex-1 p-6 overflow-auto custom-scrollbar relative">
         {children}
      </div>
    </motion.div>
  );
}
