'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

import {
  Apple,
  Dumbbell,
  Zap,
  Moon,
  Users,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

const PILLARS = [
  { title: 'Nutrition', icon: Apple, color: '#10b981', link: '/nutrition', status: 'On Track' },
  { title: 'Activity', icon: Dumbbell, color: '#f59e0b', link: '/activity', status: 'Due' },
  { title: 'Stress', icon: Zap, color: '#14b8a6', link: '/stress', status: 'Check' },
  { title: 'Sleep', icon: Moon, color: '#3b82f6', link: '/sleep', status: 'Good' },
  { title: 'Social', icon: Users, color: '#ef4444', link: '/social', status: 'Active' },
  { title: 'Risky', icon: ShieldAlert, color: '#f97316', link: '/risky', status: 'Safe' },
  { title: 'Education', icon: BookOpen, color: '#3b82f6', link: '/education', status: 'New' },
  { title: 'Rewards', icon: Award, color: '#10b981', link: '/rewards', status: 'Earned' },
];


export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string; created_at?: string }>>([
    { role: 'bot', content: "Hello! I'm your Chu Health Assistant. Ask me anything about your health!" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const { user } = useAuth();
  const recognitionRef = useRef<any>(null);

  // Load chat messages from Supabase
  useEffect(() => {
    if (user && isChatOpen) {
      loadChatMessages();
    }
  }, [user, isChatOpen]);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const loadChatMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setChatMessages(data.map(msg => ({
        role: msg.role,
        content: msg.content,
        created_at: msg.created_at
      })));
    }
  };

  const saveChatMessage = async (role: string, content: string) => {
    if (!user) return;

    await supabase.from('chat_messages').insert([{
      user_id: user.id,
      role,
      content
    }]);
  };

  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: text };
    setChatMessages(prev => [...prev, userMessage]);
    await saveChatMessage('user', text);

    // Get intelligent response from health knowledge base
    const { getHealthAnswer } = await import('@/lib/health-knowledge');
    const botResponse = { role: 'bot', content: getHealthAnswer(text) };

    setTimeout(async () => {
      setChatMessages(prev => [...prev, botResponse]);
      await saveChatMessage('bot', botResponse.content);
    }, 1000);
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-3 w-full animate-fade-in">

        {/* HEADER: Score & Brand (Balanced) */}
        <section className={`app-section !border-black bg-primary-tint !py-4 dashboard-header`}>
          <img src="/logo.png" alt="Chu Precision Health" style={{ width: '150px' }} className="mb-2" />


          {/* Precision Score (One Line) */}
          <div className="flex items-center gap-2">
            <span className="uppercase font-bold tracking-wider" style={{ fontSize: '20pt', color: '#000000' }}>PRECISION SCORE:</span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold" style={{ fontSize: '20pt', color: '#000000' }}>84/100</span>
            </div>
          </div>

          {/* Weekly Status (One Line) */}
          <div className="flex items-center gap-2">
            <span className="uppercase font-bold tracking-wider" style={{ fontSize: '20pt', color: '#000000' }}>WEEKLY STATUS:</span>
            <p className="font-bold" style={{ fontSize: '20pt', color: '#000000' }}>On Target</p>
          </div>
        </section>

        {/* QUICK LOG BANNER */}
        <div className="p-3 border-2 border-black rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-primary" />
            <p className="text-body font-bold">Today: Log 30m Movement</p>
          </div>
          <ChevronRight size={18} className="text-primary" />
        </div>

        {/* PILLAR GRID (2-Column for 15pt) */}
        <div className="pillar-grid">
          {PILLARS.map((p) => (
            <Link
              href={p.link}
              key={p.title}
              className="app-section !p-4 flex items-center justify-between hover:bg-black/5 active:scale-95 transition-all"
              style={{ borderLeft: `6px solid ${p.color}` }}
            >
              <div className="flex items-center gap-2">
                <p.icon size={16} style={{ color: p.color }} />
                <h3 className="title-md">{p.title}</h3>
              </div>
              <span className="text-small font-bold" style={{ color: p.color }}>{p.status.toUpperCase()}</span>
            </Link>
          ))}

        </div>

      </div>

      {/* Chat Bot Button - Fixed to viewport for true centering */}
      <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          style={{ width: '50px', height: '50px' }}
        >
          <img src="/bot-icon.png" alt="Chat" className="w-full h-full object-contain" />
        </button>
      </div>

      {/* Fullscreen Chat Popup */}
      {isChatOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
          {/* Use same header as other pages */}
          <Navbar customTitle="Chat Conversation" />

          {/* Chat Summary Section with Mic */}
          <div className="app-section !border-black bg-primary-tint p-1 m-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-[16pt] font-black uppercase">💬 Chat Summary</h3>
                <p className="text-[13pt] font-bold">Total Messages: {chatMessages.length}</p>
                <p className="text-[11pt] opacity-70">Your health assistant is ready to help</p>
              </div>

              {/* Voice Input Button - Integrated */}
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`rounded-2xl shadow-xl flex items-center justify-center transition-all overflow-hidden ${isListening ? 'scale-110 animate-pulse ring-4 ring-red-500' : 'hover:scale-105'}`}
                style={{ width: '100px', height: '100px', touchAction: 'none' }}
                title={isListening ? 'Listening...' : 'Hold to speak'}
              >
                <img src="/support-icon.png" alt="Hold to speak" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f9fafb' }}>
            <div className="flex flex-col gap-2">
              {[...chatMessages].reverse().map((msg, index) => (
                <section key={index} className="app-section p-1">
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl shadow-sm border-2 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-100'}`}>
                      <p className="text-[13pt] font-bold">{msg.content}</p>
                      {msg.created_at && (
                        <p className="text-[9pt] opacity-50 mt-1">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Close Buttons - Fixed at Bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', borderTop: '2px solid #e5e7eb' }}>
            <button
              onClick={() => setIsChatOpen(false)}
              className="btn-logout"
            >
              CLOSE
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="btn-logout"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
