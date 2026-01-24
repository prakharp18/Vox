"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  LogOut,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  Copy,
  ExternalLink,
  RefreshCcw,
  X,
  Loader2,
  Share2
} from "lucide-react";
import { DashboardWindow } from "@/components/dashboard/dashboard-window";
import { ShareModal } from "@/components/share-modal";
import { MagneticButton } from "@/components/magnetic-button";
import { toast } from "sonner";
import { Shader, Swirl } from "shaders/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/user";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);


  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.info("Feed Refreshed", { description: "Latest messages loaded." });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", { 
        description: axiosError.response?.data.message || "Failed to fetch messages" 
      });
    } finally {
        setIsLoading(false);
    }
  }, []);

  const fetchAcceptMessageStatus = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setAcceptMessages(response.data.isAcceptingMessages as boolean);
    } catch (error) {
       console.error("Error fetching status", error);
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || status !== "authenticated") return; 
    fetchMessages();
    fetchAcceptMessageStatus();
  }, [session, status, fetchMessages, fetchAcceptMessageStatus]);


  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setAcceptMessages(!acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", { 
        description: axiosError.response?.data.message || "Failed to update status" 
      });
    }
  };


  const handleDeleteMessage = async (messageId: string) => {
    try {
        setMessages(messages.filter((m) => (m._id as any) !== messageId));
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
        toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", { 
        description: axiosError.response?.data.message || "Failed to delete message" 
      });
      fetchMessages();
    }
  };

  const handleDeleteAllMessages = async () => {
    try {
        const response = await axios.delete<ApiResponse>('/api/delete-all-messages');
        setMessages([]);
        toast.success(response.data.message);
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Error", { 
            description: axiosError.response?.data.message || "Failed to clear messages" 
        });
        fetchMessages();
    }
  };

  const handleDeleteAccount = async () => {
    try {
        const response = await axios.delete<ApiResponse>('/api/delete-account');
        toast.success(response.data.message);
        signOut({ callbackUrl: '/sign-up' });
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Error", { 
            description: axiosError.response?.data.message || "Failed to delete account" 
        });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileLink);
    toast.success("Link Copied!", { description: "Share it with your friends." });
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message Copied to Clipboard");
  };

  if (!session || !session.user) {
      return (
          <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
              <Loader2 className="animate-spin text-white mb-4" />
              <p className="text-zinc-500">Redirecting...</p>
          </div>
      )
  }

  const username = session.user.username || session.user.email || "User";
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileLink = `${baseUrl}/u/${username}`;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalMessages = messages.length;
  const newMessagesToday = messages.filter(m => new Date(m.createdAt) > new Date(Date.now() - 86400000)).length;


  return (
    <main className="min-h-screen w-full bg-[#050505] text-white p-4 md:p-6 overflow-hidden relative font-sans">
      
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <Shader className="h-full w-full">
            <Swirl
                 colorA="#000000"
                 colorB="#1a1a1a"
                 speed={0.2}
                 detail={0.1}
                 blend={50}
            />
        </Shader>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-6 min-h-[calc(100vh-3rem)] h-auto md:h-[calc(100vh-3rem)]">
        
        <DashboardWindow className="md:col-span-4 md:row-span-2">
            <div className="flex flex-col justify-between h-full p-4">
                 <div>
                    <h2 className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-1">Welcome back,</h2>
                     <h1 className="text-3xl font-light text-white truncate tracking-tight">
                        {username}
                     </h1>
                     <div className="flex items-center gap-2 mt-2">
                        <span className={`w-2 h-2 rounded-full ${acceptMessages ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
                        <span className={`text-sm font-medium ${acceptMessages ? 'text-emerald-500' : 'text-zinc-500'}`}>
                            {acceptMessages ? 'Accepting Messages' : 'Offline'}
                        </span>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">Total</span>
                        <p className="text-3xl font-light text-white mt-1">{totalMessages}</p>
                    </div>
                    <div>
                        <span className="text-emerald-500/70 text-xs font-semibold tracking-wider uppercase">New (24h)</span>
                        <p className="text-3xl font-light text-emerald-500 mt-1">+{newMessagesToday}</p>
                    </div>
                 </div>
            </div>
        </DashboardWindow>

        <DashboardWindow 
            title="Incoming Feed" 
            className="md:col-span-8 md:row-span-6 bg-[#09090b] border-zinc-800/50 h-[500px] md:h-auto"
            rightContent={
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800/50 max-w-[180px] sm:max-w-none">
                        <LogOut size={12} className="text-zinc-500 shrink-0" />
                        <span className="text-[10px] text-zinc-400 font-medium leading-tight line-clamp-2 sm:line-clamp-none">
                            Security Tip: Always sign out before closing the browser. This clears your active session and prevents "Application error" messages.
                        </span>
                    </div>
                    <button 
                        onClick={() => fetchMessages(true)}
                        disabled={isLoading}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            }
        >
            <div className="h-full overflow-y-auto p-4 md:p-6 custom-scrollbar">
                 {isLoading && messages.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center">
                         <Loader2 className="animate-spin text-zinc-500 mb-2" />
                         <span className="text-zinc-500 text-sm">Synchronizing Feed...</span>
                     </div>
                 ) : messages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {messages.map((message) => (
                            <div 
                                key={message._id as unknown as string} 
                                className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-2xl relative group hover:border-zinc-700 transition-colors"
                            >
                                <div className="absolute top-3 right-3 opacity-100 flex gap-2">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="p-2 bg-zinc-800/50 text-zinc-400 rounded-full hover:bg-red-500 hover:text-white transition-all">
                                                <X size={14} />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                                            <AlertDialogHeader>
                                            <AlertDialogTitle className="text-white">Delete Message?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-zinc-400">
                                                This action cannot be undone. This will permanently delete this message.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-transparent border-zinc-800 text-white hover:bg-zinc-900">Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteMessage(message._id as any)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    
                                    <button 
                                        onClick={() => handleCopyMessage(message.content)}
                                        className="p-2 bg-zinc-800/50 text-zinc-400 rounded-full hover:bg-zinc-700 hover:text-white transition-all"
                                    >
                                        <Copy size={14} />
                                    </button>

                                    <ShareModal 
                                        message={message.content} 
                                        username={username}
                                        trigger={
                                            <button className="p-2 bg-zinc-800/50 text-zinc-400 rounded-full hover:bg-zinc-700 hover:text-white transition-all">
                                                <Share2 size={14} />
                                            </button>
                                        }
                                    />
                                </div>
                                
                                <p className="text-zinc-200 text-lg font-light leading-relaxed">
                                    {message.content}
                                </p>
                                <span className="text-zinc-600 text-xs mt-4 block">
                                    {new Date(message.createdAt).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800/50">
                            <MessageSquare size={32} className="text-zinc-400" />
                        </div>
                        <h3 className="text-zinc-200 text-xl font-medium mb-2">No Messages Yet</h3>
                        <p className="text-zinc-500 text-base max-w-sm mx-auto mb-8 leading-relaxed">
                            Your feed is waiting for messages.
                        </p>
                    </div>
                 )}
            </div>
        </DashboardWindow>

        <DashboardWindow 
            title="Control Panel" 
            className="md:col-span-4 md:row-span-4"
        >
             <div className="h-full flex flex-col gap-4 p-2">
                 
                 <div className="space-y-3">
                     <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                        <span className="text-zinc-300 text-sm font-medium">Accept Messages</span>
                        <div className="flex items-center gap-2">
                             <Switch 
                                checked={acceptMessages} 
                                onCheckedChange={handleSwitchChange}
                                disabled={isSwitchLoading}
                             />
                        </div>
                     </div>

                     <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 flex items-center gap-2">
                        <div className="flex-1 overflow-hidden">
                            <span className="text-zinc-500 text-xs block mb-1">Your Unique Link</span>
                            <div className="text-zinc-300 text-sm truncate bg-black/20 p-1 rounded-md">
                                {profileLink}
                            </div>
                        </div>
                        <MagneticButton 
                            onClick={copyToClipboard}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white border-0 rounded-xl h-10 w-10 flex items-center justify-center p-0"
                        >
                            <Copy size={16} />
                        </MagneticButton>
                     </div>

                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="w-full py-2 text-xs font-medium text-zinc-500 hover:text-red-500 transition-colors border border-dashed border-zinc-800 rounded-xl hover:border-red-500/30">
                                Clear Feed (Delete All)
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Clear entire feed?</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                    This will permanently remove every message from your dashboard and our servers. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-zinc-800 text-white hover:bg-zinc-900">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAllMessages} className="bg-red-600 hover:bg-red-700 text-white">Clear All</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 </div>

                 <div className="mt-auto px-2 space-y-3 pb-2">
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-zinc-500">Security</span>
                         <span className="text-emerald-500/80 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">AES-256</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-zinc-500">System Time</span>
                         <span className="text-zinc-400 text-xs">
                             {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                         </span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-zinc-500">Database</span>
                         <span className="text-emerald-500 text-xs font-medium flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             Connected
                         </span>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-2 mt-2">
                    <MagneticButton 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-0 rounded-2xl h-12 text-sm font-medium"
                    >
                        Sign Out
                    </MagneticButton>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <MagneticButton 
                                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border-0 rounded-2xl h-12 text-sm font-medium"
                            >
                                Delete
                            </MagneticButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Account?</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                    This will permanently delete your account and all associated messages. This action is irreversible.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-zinc-800 text-white hover:bg-zinc-900">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">Delete Account</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 </div>
             </div>
        </DashboardWindow>

      </div>
    </main>
  );
}
