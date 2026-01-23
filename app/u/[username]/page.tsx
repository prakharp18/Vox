'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Wand2, Sparkles, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  if (!messageString) return [];
  return messageString.split(specialChar).filter(msg => msg.trim() !== '');
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const [suggestions, setSuggestions] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestError(null);
    try {
      const response = await axios.post<{ questions: string }>('/api/suggest-messages', {});
      setSuggestions(response.data.questions || '');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setSuggestError(axiosError.response?.data?.message || "Failed to fetch suggestions");
    } finally {
        setIsSuggestLoading(false);
    }
  };

  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [isCheckingDB, setIsCheckingDB] = useState(true);

  React.useEffect(() => {
    const fetchStatus = async () => {
        setIsCheckingDB(true);
        try {
            const response = await axios.get<ApiResponse>(`/api/check-username?username=${username}`);
            setIsAcceptingMessages(response.data.isAcceptingMessages ?? true);
        } catch (error) {
            // Silently fail or handled by UI state
        } finally {
            setIsCheckingDB(false);
        }
    };
    fetchStatus();
  }, [username]);


  return (
    <main className="h-screen w-full bg-black text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black" />

      <div className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-full backdrop-blur-md">
         <div className={`w-2 h-2 rounded-full ${isCheckingDB ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
         <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
            {isCheckingDB ? 'CONNECTING...' : 'SYSTEM ONLINE'}
         </span>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-4 h-full md:h-[600px]">
        
        <div className="md:col-span-7 flex flex-col gap-4 h-full">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center h-[20%]">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    VOX <span className="text-zinc-600 font-mono text-lg font-normal">/ PUBLIC</span>
                </h1>
                <p className="text-zinc-400 mt-1 text-sm md:text-base">
                    Sending to <span className="text-white font-semibold">@{username}</span>
                </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex-1 shadow-2xl flex flex-col relative overflow-hidden">
                {!isAcceptingMessages ? (
                    <div className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-sm w-full">
                            <h3 className="text-xl font-bold text-white mb-2">Unavailable</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                @{username} is currently not accepting new messages. Please check back later.
                            </p>
                            <Link href="/sign-up">
                                <Button variant="secondary" className="w-full">
                                    Create Your Own Board
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : null}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="flex-1 flex flex-col">
                                    <FormLabel className="text-zinc-300 text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-indigo-500" />
                                        Compose Message
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type something anonymous..."
                                            className="flex-1 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 text-lg md:text-xl p-4 resize-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 rounded-xl leading-relaxed"
                                            {...field}
                                            disabled={!isAcceptingMessages}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400 mt-2" />
                                </FormItem>
                            )}
                        />
                        <div className="mt-6">
                             <Button 
                                type="submit" 
                                size="lg" 
                                disabled={isLoading || !messageContent || !isAcceptingMessages}
                                className="w-full font-bold tracking-wide rounded-xl bg-white text-black hover:bg-zinc-200"
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> SENDING</>
                                ) : (
                                    <><Send className="mr-2 h-4 w-4" /> SEND MESSAGE</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-4 h-full">
            
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex-1 flex flex-col overflow-hidden relative group">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-zinc-300 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                        <Wand2 className="w-3 h-3 text-purple-500" />
                        Inspiration
                    </h3>
                    <Button
                        onClick={fetchSuggestedMessages}
                        variant="outline"
                        size="sm"
                        disabled={isSuggestLoading}
                        className="h-8 text-xs border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
                    >
                        {isSuggestLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <RefreshCcw className="w-3 h-3 mr-2" />}
                        Refresh
                    </Button>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
                    {suggestError ? (
                        <div className="text-red-400 text-xs p-2 border border-red-500/20 bg-red-500/10 rounded">
                            {suggestError}
                        </div>
                    ) : (
                        parseStringMessages(suggestions).map((message, index) => (
                             <button
                                key={index}
                                onClick={() => handleMessageClick(message)}
                                className="text-left p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-[0.98] group/btn"
                            >
                                <p className="text-zinc-400 text-sm leading-snug group-hover/btn:text-white transition-colors">
                                    "{message}"
                                </p>
                            </button>
                        ))
                    )}
                    {!suggestions && !isSuggestLoading && !suggestError && (
                         <div className="flex-1 flex items-center justify-center text-zinc-700 text-sm italic">
                            Hit refresh for ideas...
                         </div>
                    )}
                </div>
            </div>

            <div className="bg-white text-black border border-zinc-200 rounded-2xl p-6 h-[25%] flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200/50 to-transparent pointer-events-none" />
                <h3 className="font-bold text-lg mb-1 relative z-10">Get your own board</h3>
                <p className="text-zinc-600 text-xs mb-3 relative z-10">Start receiving anonymous messages today.</p>
                <Link href="/sign-up" className="relative z-10 w-full">
                     <Button variant="outline" className="w-full border-2 border-black/10 hover:border-black hover:bg-transparent text-black font-bold rounded-xl h-12">
                        JOIN VOX
                    </Button>
                </Link>
            </div>

        </div>

      </div>
    </main>
  );
}
