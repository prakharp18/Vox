"use client";

import React, { useRef, useState, useEffect } from "react";
import { Download, Share2, Twitter, Instagram, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toPng } from 'html-to-image';
import { toast } from "sonner";
import { Shader, Swirl } from "shaders/react";

interface ShareModalProps {
  message: string;
  username: string;
  trigger?: React.ReactNode;
}

const themes = [
    {
        name: 'Emerald',
        background: 'linear-gradient(to bottom right, #000000, #064e3b)',
        accent: '#34d399', 
        bubble: '#10b981', 
        border: '#ffffff'
    },
    {
        name: 'Violet',
        background: 'linear-gradient(to bottom right, #000000, #4c1d95)',
        accent: '#a78bfa',
        bubble: '#8b5cf6',
        border: '#ffffff'
    },
    {
        name: 'Rose',
        background: 'linear-gradient(to bottom right, #000000, #be123c)',
        accent: '#fb7185',
        bubble: '#f43f5e',
        border: '#ffffff'
    },
    {
        name: 'Blue',
        background: 'linear-gradient(to bottom right, #000000, #1e40af)',
        accent: '#60a5fa',
        bubble: '#3b82f6',
        border: '#ffffff'
    },
    {
        name: 'Amber',
        background: 'linear-gradient(to bottom right, #000000, #b45309)',
        accent: '#fbbf24',
        bubble: '#f59e0b',
        border: '#ffffff'
    }
];

export function ShareModal({ message, username, trigger }: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reply, setReply] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [siteUrl, setSiteUrl] = useState("VOX.APP");

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setSiteUrl(window.location.host.toUpperCase());
    }
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `vox-message-${Date.now()}.png`;
      link.click();
      
      toast.success("Saved to Gallery!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to save image. Try taking a screenshot manually.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white w-[95vw] max-w-sm p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="overflow-y-auto flex-1 custom-scrollbar" data-lenis-prevent>
        <div className="p-6 pb-2">
            <DialogTitle className="text-lg font-bold">Share Message</DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
                Reply and share this on your story.
            </DialogDescription>
        </div>


        <div className="px-6 mb-4 space-y-3">
            <input 
                type="text" 
                placeholder="Type your reply here..."
                value={reply}
                maxLength={50}
                onChange={(e) => setReply(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
            
            <div className="flex justify-center gap-2">
                {themes.map((theme, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedTheme(theme)}
                        className={`w-6 h-6 rounded-full transition-all overflow-hidden shadow-sm ${selectedTheme.name === theme.name ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                        style={{ background: theme.background }}
                    />
                ))}
            </div>
        </div>

        <div className="flex justify-center p-6 bg-zinc-900/50 relative overflow-hidden">
          <div
            ref={cardRef}
            id="capture-card"
            className="w-[300px] aspect-[9/16] relative rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ backgroundColor: '#000000', color: '#ffffff' }}
          >
            <div className="absolute inset-0 z-0" style={{ background: selectedTheme.background }} />

            <div className="relative z-10 p-6 flex flex-col h-full justify-between backdrop-blur-[1px]">
                 <div className="flex items-center gap-2 mb-4 opacity-80">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2" style={{ backgroundColor: selectedTheme.bubble, color: '#000000', borderColor: selectedTheme.border }}>
                        VOX
                    </div>
                    <span className="text-xs font-bold tracking-wider" style={{ color: selectedTheme.accent }}>@{username}</span>
                 </div>

                 <div className="flex-1 flex flex-col justify-center min-h-0">
                    <div className="p-5 rounded-2xl shadow-lg mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: '1px', borderStyle: 'solid' }}>
                        <p className="font-medium text-lg leading-relaxed font-sans break-words whitespace-pre-wrap" style={{ color: '#ffffff', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                            {message}
                        </p>
                    </div>

                    {reply && (
                        <div className="self-end max-w-[85%]">
                            <div className="p-4 rounded-2xl rounded-tr-sm shadow-lg" style={{ backgroundColor: selectedTheme.bubble, color: '#000000' }}>
                                <p className="font-bold text-sm leading-snug break-words whitespace-pre-wrap" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                    {reply}
                                </p>
                            </div>
                        </div>
                    )}
                 </div>

                 <div className="mt-auto pt-6 flex justify-center opacity-60">
                    <div className="text-[10px] tracking-[0.3em] font-light" style={{ color: '#ffffff' }}>
                        {siteUrl}
                    </div>
                 </div>
            </div>
          </div>
        </div>


        </div>
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
            <Button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 bg-white text-black hover:bg-zinc-200 font-bold"
            >
                {isDownloading ? (
                    "Saving..."
                ) : (
                   <> <Download className="mr-2 h-4 w-4" /> Save to Gallery</>
                )}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

