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
  const [dailySteps, setDailySteps] = useState(0);
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [manualStepInput, setManualStepInput] = useState('');
  const { user } = useAuth();
  const recognitionRef = useRef<any>(null);
  const lastAccelRef = useRef({ x: 0, y: 0, z: 0, timestamp: 0 });

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

  // Accelerometer-based step counting
  useEffect(() => {
    let stepCount = 0;
    const STEP_THRESHOLD = 1.2; // Acceleration threshold for detecting a step
    const STEP_DELAY = 250; // Minimum ms between steps

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      const handleMotion = (event: DeviceMotionEvent) => {
        const accel = event.accelerationIncludingGravity;
        if (!accel) return;

        const now = Date.now();
        const timeDiff = now - lastAccelRef.current.timestamp;

        if (timeDiff < STEP_DELAY) return;

        // Calculate total acceleration magnitude
        const x = accel.x || 0;
        const y = accel.y || 0;
        const z = accel.z || 0;
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        // Detect significant movement (potential step)
        const lastMagnitude = Math.sqrt(
          lastAccelRef.current.x ** 2 +
          lastAccelRef.current.y ** 2 +
          lastAccelRef.current.z ** 2
        );

        if (Math.abs(magnitude - lastMagnitude) > STEP_THRESHOLD) {
          stepCount++;
          setDailySteps(prev => prev + 1);
          lastAccelRef.current.timestamp = now;
        }

        lastAccelRef.current = { x, y, z, timestamp: now };
      };

      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, []);

  // Manual step entry handler
  const handleManualStepEntry = () => {
    const steps = parseInt(manualStepInput);
    if (!isNaN(steps) && steps >= 0) {
      setDailySteps(steps);
      setIsEditingSteps(false);
      setManualStepInput('');
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', padding: '4px' }}>

        {/* HEADER SECTION */}
        <section style={{
          border: '2px solid black',
          borderRadius: '12px',
          backgroundColor: '#E8F5E9',
          padding: '16px',
          margin: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>


          {/* Brand Name */}
          <h1 style={{
            fontWeight: 'bold',
            fontSize: '20pt',
            color: '#1F363D',
            whiteSpace: 'nowrap',
            margin: 0
          }}>
            Chu Precision Health Center
          </h1>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src="/logo.png"
              alt="Chu Precision Health"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderTop: '2px solid black',
              borderBottom: '2px solid black',
              padding: '4px 8px',
              backgroundColor: 'white'
            }}>
              <span style={{ fontSize: '18pt', fontWeight: 'bold', textTransform: 'uppercase' }}>PRECISION SCORE:</span>
              <span style={{ fontSize: '18pt', fontWeight: 'bold' }}>84/100</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderTop: '2px solid black',
              borderBottom: '2px solid black',
              padding: '4px 8px',
              backgroundColor: 'white'
            }}>
              <span style={{ fontSize: '18pt', fontWeight: 'bold', textTransform: 'uppercase' }}>WEEKLY STATUS:</span>
              <span style={{ fontSize: '18pt', fontWeight: 'bold' }}>On Target</span>
            </div>
          </div>
        </section>

        {/* STEPS SECTION */}
        <section style={{
          border: '2px solid black',
          borderRadius: '12px',
          backgroundColor: 'white',
          padding: '16px',
          margin: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px'
        }}>
          <p
            style={{ fontSize: '30pt', fontWeight: 'bold', color: 'black', margin: 0, cursor: 'pointer' }}
            onClick={() => {
              setIsEditingSteps(true);
              setManualStepInput(dailySteps.toString());
            }}
            title="Click to edit steps"
          >
            {isEditingSteps ? (
              <input
                type="number"
                value={manualStepInput}
                onChange={(e) => setManualStepInput(e.target.value)}
                onBlur={handleManualStepEntry}
                onKeyPress={(e) => e.key === 'Enter' && handleManualStepEntry()}
                autoFocus
                style={{
                  fontSize: '30pt',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: '2px solid black',
                  borderRadius: '8px',
                  padding: '4px',
                  width: '180px'
                }}
              />
            ) : (
              dailySteps.toLocaleString()
            )}
          </p>
          <p style={{ fontSize: '18pt', fontWeight: 'bold', color: 'black', margin: 0 }}>
            Steps
          </p>
          <p style={{ fontSize: '10pt', color: '#666', margin: 0, fontStyle: 'italic' }}>
            {dailySteps > 0 ? 'Auto-tracking • Click to edit' : 'Click number to enter manually'}
          </p>
        </section>

        {/* BUTTONS SECTION */}
        <section style={{
          border: '2px solid black',
          borderRadius: '12px',
          backgroundColor: 'white',
          padding: '16px',
          margin: '4px'
        }}>
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
        </section>

      </div >

      {/* Chat Bot Button - Fixed Position */}
      < div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }
      }>
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            borderRadius: '50%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          <img src="/support-icon.png" alt="Chat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      </div >

      {/* Fullscreen Chat Popup */}
      {
        isChatOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
            <Navbar customTitle="Chat Conversation" />

            {/* Chat Summary Section */}
            <div className="app-section !border-black bg-primary-tint p-1 m-1">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[16pt] font-black uppercase">💬 Chat Summary</h3>
                  <p className="text-[13pt] font-bold">Total Messages: {chatMessages.length}</p>
                  <p className="text-[11pt] opacity-70">Your health assistant is ready to help</p>
                </div>

                {/* Voice Input Container */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`rounded-2xl shadow-xl flex items-center justify-center transition-all overflow-hidden ${isListening ? 'scale-110 animate-pulse ring-4 ring-red-500' : 'hover:scale-105'}`}
                    style={{ width: '100px', height: '100px', touchAction: 'none' }}
                  >
                    <img src="/support-icon.png" alt="Hold to speak" className="w-full h-full object-cover" />
                  </button>
                  <span className="text-[10pt] font-black uppercase tracking-wider text-black mt-1">
                    {isListening ? 'Listening...' : 'Hold to Speak'}
                  </span>
                </div>
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

            {/* Close Buttons */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', borderTop: '2px solid #e5e7eb' }}>
              <button onClick={() => setIsChatOpen(false)} className="btn-logout">CLOSE</button>
              <button onClick={() => setIsChatOpen(false)} className="btn-logout">CLOSE</button>
            </div>
          </div>
        )
      }
    </ProtectedRoute >
  );
}
