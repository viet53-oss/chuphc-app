'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Mic, Volume2, VolumeX } from 'lucide-react';
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
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Only show on the home screen as requested
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
        setIsOpen(true);

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

    const handleSend = () => {
        if (!input.trim()) return;
        processMessage(input);
        setInput('');
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
            {/* Listening Overlay */}
            {isListening && (
                <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-[0_0_80px_rgba(45,90,39,0.8)]">
                        <Mic size={60} className="text-white" />
                    </div>
                    <h2 className="mt-10 text-[24pt] font-black uppercase text-white tracking-[0.2em] animate-bounce">Listening...</h2>
                    <p className="mt-4 text-white/40 font-bold uppercase tracking-widest text-[12pt]">Ask your health question</p>
                </div>
            )}

            {/* Center Bottom Home Button */}
            {!isOpen && isHome && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="group flex flex-col items-center gap-1"
                    >
                        <div className="relative transform transition-all group-hover:scale-110 active:scale-95" style={{ width: '35px', height: '35px' }}>
                            <img
                                src="/bot-icon.png"
                                alt="Chu Bot"
                                className="w-full h-full object-contain drop-shadow-lg"
                            />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                        </div>
                        <span className="text-[7pt] font-black uppercase tracking-widest text-black/30 group-hover:text-primary transition-colors">
                            Assistant
                        </span>
                    </button>
                </div>
            )}

            {/* FULLSCREEN Chat Window */}
            <div className={`fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden transition-all duration-500 ease-spring ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95 pointer-events-none'}`}>

                {/* Fullscreen Header */}
                <div className="bg-black text-white p-8 pt-12 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 transform -rotate-3 shadow-xl">
                            <img src="/bot-icon.png" alt="Bot" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h3 className="text-[20pt] font-black uppercase tracking-tighter leading-tight">Chu Assistant</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-[10pt] font-bold opacity-60 uppercase tracking-widest">Precision Specialist</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSpeaking(!isSpeaking)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${isSpeaking ? 'bg-primary/20 text-primary border-2 border-primary/20' : 'bg-gray-100 text-gray-400'}`}
                        >
                            {isSpeaking ? <Volume2 size={24} /> : <VolumeX size={24} />}
                        </button>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                if (synthRef.current) synthRef.current.cancel();
                            }}
                            className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                        >
                            <X size={28} />
                        </button>
                    </div>
                </div>

                {/* Messages Hub */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-8 no-scrollbar bg-gray-50/30">
                    <div className="max-w-3xl mx-auto flex flex-col gap-6">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                                <div className={`p-6 sm:p-8 rounded-[2.5rem] flex gap-5 shadow-2xl ${msg.role === 'user' ? 'max-w-[85%] bg-black text-white rounded-tr-none' : 'max-w-full bg-white border-2 border-gray-100 rounded-tl-none'}`}>
                                    {msg.role === 'bot' && (
                                        <div className="shrink-0 mt-2">
                                            <Sparkles size={24} className="text-primary animate-pulse" />
                                        </div>
                                    )}
                                    <p className="text-[13pt] sm:text-[15pt] font-bold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fullscreen Input Footer */}
                <div className="p-8 pb-12 bg-white border-t border-gray-100">
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                className="w-full bg-gray-100 rounded-[2rem] p-6 pr-20 text-[14pt] font-bold outline-none border-2 border-transparent focus:border-black transition-all shadow-inner"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-3 top-3 w-14 h-14 bg-black text-white rounded-[1.5rem] flex items-center justify-center hover:bg-primary transition-all active:scale-95 shadow-xl"
                            >
                                <Send size={24} />
                            </button>
                        </div>

                        <button
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onMouseLeave={stopRecording}
                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-primary text-white'}`}
                        >
                            <Mic size={28} />
                        </button>
                    </div>
                    <p className="text-center mt-4 text-[9pt] font-black uppercase text-gray-400 tracking-widest">Hold Mic to talk • Text or Voice</p>
                </div>

            </div>
        </>
    );
}
