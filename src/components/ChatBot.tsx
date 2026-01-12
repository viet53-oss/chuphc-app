'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Mic, Volume2, VolumeX } from 'lucide-react';
import { DIET_BIBLE } from '@/lib/diet-knowledge';
import { usePathname } from 'next/navigation';

export default function ChatBot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(true);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am your Chu Precision Health Assistant. How can I help you optimize your health today?' }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    const isHome = pathname === '/';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        synthRef.current = window.speechSynthesis;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                processMessage(transcript);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const speak = (text: string) => {
        if (!isSpeaking || !synthRef.current) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        synthRef.current.speak(utterance);
    };

    const processMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = text.toLowerCase();

        let botResponse = DIET_BIBLE.default;
        for (const faq of DIET_BIBLE.faqs) {
            if (faq.keywords.some(keyword => currentInput.includes(keyword))) {
                botResponse = faq.answer;
                break;
            }
        }

        if (currentInput.includes('rule') || currentInput.includes('bible') || currentInput.includes('guide')) {
            botResponse = "Here are our core metabolic rules:\n\n" + DIET_BIBLE.principles.join("\n\n");
        }

        setTimeout(() => {
            const botMsg = { role: 'bot', content: botResponse };
            setMessages(prev => [...prev, botMsg]);
            speak(botResponse);
        }, 800);
    };

    const startRecording = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (recognitionRef.current) {
            if (synthRef.current) synthRef.current.cancel();
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

    if (!isHome && !isOpen) return null;

    return (
        <>
            {/* Small Chat Icon - Bottom Center of Home Page */}
            {!isOpen && isHome && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="transform transition-all hover:scale-110 active:scale-95"
                        style={{ width: '20px', height: '20px' }}
                    >
                        <img
                            src="/bot-icon.png"
                            alt="Chu Assistant"
                            className="w-full h-full object-contain"
                        />
                    </button>
                </div>
            )}

            {/* FULLSCREEN Chat Popup */}
            <div className={`fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-black text-white p-6 flex items-center justify-end shadow-lg">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSpeaking(!isSpeaking)}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-400'}`}
                        >
                            {isSpeaking ? <Volume2 size={22} /> : <VolumeX size={22} />}
                        </button>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                if (synthRef.current) synthRef.current.cancel();
                            }}
                            className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                        >
                            <X size={26} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    <div className="max-w-3xl mx-auto flex flex-col gap-5">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-5 rounded-3xl max-w-[85%] ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white border-2 border-gray-100 shadow-sm'}`}>
                                    <p className="text-[13pt] font-bold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom - Hold to Talk */}
                <div className="p-8 bg-white border-t border-gray-100">
                    <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
                        <button
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onMouseLeave={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${isListening ? 'bg-red-500 scale-110 animate-pulse' : 'bg-primary hover:scale-105'}`}
                            style={{ touchAction: 'none' }}
                        >
                            <Mic size={32} className="text-white" />
                        </button>
                        <p className="text-[10pt] font-black uppercase text-gray-400 tracking-widest">
                            {isListening ? 'Listening...' : 'Hold Mic to Talk • Text or Voice'}
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}
