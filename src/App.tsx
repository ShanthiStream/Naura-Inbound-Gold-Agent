/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback, useEffect, useRef } from "react";

function ConversationInterface() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnecting(false);
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    },
    onDisconnect: () => {
      setIsConnecting(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    },
    onError: (err) => {
      setError(typeof err === 'string' ? err : "Connection failed");
      setIsConnecting(false);
    },
  });

  const startAssistant = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: "agent_6501kr69fgs8fwvar4mbj99ppfcq",
        connectionType: "websocket",
        dynamicVariables: {
          customer_name: customerName || "Guest",
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed. Please check your mic and network.");
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopAssistant = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="w-full max-w-[400px] h-[720px] bg-[#0A0A0B] rounded-[48px] border-[8px] border-[#1C1C1E] shadow-2xl overflow-hidden relative flex flex-col font-sans mb-8">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-gradient-to-br from-amber-500/20 via-transparent to-yellow-600/10 blur-[80px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Header */}
      <div className="pt-12 pb-8 px-6 text-center z-10">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="text-[10px] font-mono tracking-widest text-amber-500/80 uppercase tracking-widest">KFH Gold Premium</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Naura</h1>
        <p className="text-sm font-medium text-amber-500/60">
          {isConnected ? formatDuration(duration) : isConnecting ? "Connecting..." : "KFH Gold AI Agent"}
        </p>
      </div>

      {/* Central Visualizer / Avatar */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="relative group">
          <AnimatePresence mode="wait">
            {isConnected ? (
              <motion.div
                key="active"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                {/* Reactive Pulse */}
                <AnimatePresence>
                  {conversation.isSpeaking && (
                      <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl"
                    />
                  )}
                </AnimatePresence>

                <div className="w-64 h-64 rounded-full bg-gradient-to-b from-[#1C1C1E] to-[#0A0A0B] border border-white/5 flex items-center justify-center relative overflow-hidden shadow-2xl">
                  {/* Energy Sphere */}
                  <motion.div
                    animate={conversation.isSpeaking ? {
                      scale: [1, 1.05, 1],
                      boxShadow: ["0 0 20px rgba(245, 158, 11, 0.2)", "0 0 40px rgba(245, 158, 11, 0.4)", "0 0 20px rgba(245, 158, 11, 0.2)"]
                    } : {
                      scale: 1,
                      boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)"
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-40 h-40 rounded-full border border-amber-500/20 flex items-center justify-center transition-colors duration-700 overflow-hidden ${
                      conversation.isSpeaking ? 'bg-amber-500/10' : 'bg-white/5'
                    }`}
                  >
                    <img 
                      src="/naura.png" 
                      alt="Naura" 
                      className={`w-full h-full object-cover transition-opacity duration-700 ${
                        conversation.isSpeaking ? 'opacity-100' : 'opacity-60'
                      }`}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-64 h-64 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/5"
              >
                <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden">
                  <img src="/naura.png" alt="Naura" className="w-full h-full object-cover opacity-40 grayscale" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center px-8">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-[0.2em]">
            {isConnected ? conversation.isSpeaking ? "Naura is speaking" : "Listening to you" : "Call standby"}
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="pb-16 px-10 z-10">
        <AnimatePresence>
          {isConnected && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-3 gap-8 mb-12"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors cursor-pointer">
                  <MicOff className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-tighter text-center">Mute</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors cursor-pointer">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-tighter text-center">Speaker</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors cursor-pointer">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-tighter text-center">Keypad</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center w-full gap-6">
          <AnimatePresence mode="wait">
            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full px-2"
              >
                <div className="relative group">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 focus:ring-4 focus:ring-amber-500/5 transition-all text-base font-light tracking-wide italic"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <User className={`w-4 h-4 transition-colors ${customerName ? 'text-amber-500' : 'text-zinc-700'}`} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="slider-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full h-16 bg-white/5 border border-white/10 rounded-full relative p-1 flex items-center overflow-hidden"
              >
                {/* Blinking Text */}
                <motion.div 
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <span className="text-zinc-500 text-sm font-semibold tracking-wide flex items-center gap-2">
                    Slide to call
                  </span>
                </motion.div>

                {/* Draggable Handle */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 240 }}
                  dragElastic={0.1}
                  dragSnapToOrigin={true}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 200 && !isConnecting) {
                      startAssistant();
                    }
                  }}
                  className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20 cursor-grab active:cursor-grabbing z-20"
                >
                  {isConnecting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Phone className="w-6 h-6 text-white fill-white ml-0.5" />
                  )}
                </motion.div>
              </motion.div>
            ) : (
              <motion.button
                key="stop"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopAssistant}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/20"
              >
                <Phone className="w-8 h-8 text-white fill-white rotate-[135deg]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="mt-6 p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-[10px] text-red-400 text-center uppercase tracking-tight">
            {error}
          </div>
        )}
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/10 rounded-full" />
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#000] text-white p-6 font-sans flex items-center justify-center">
      <ConversationProvider>
        <ConversationInterface />
      </ConversationProvider>
    </div>
  );
}
