'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Mic } from 'lucide-react';
import { DIET_BIBLE } from '@/lib/diet-knowledge';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am your Chu Precision Health Assistant. How can I help you optimize your health today?' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Setup Speech Recognition
    useEffect(() => {
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

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const processMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = text.toLowerCase();
        setIsOpen(true); // Open chat window to show result

        // Find relevant diet answer
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
        }, 800);
    };

    const handleSend = () => {
        if (!input.trim()) return;
        processMessage(input);
        setInput('');
    };

    const startRecording = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();

            // Vibrational feedback if available
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        } else {
            alert("Voice recognition is not supported in this browser. Please try Chrome or Safari.");
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return (
        <>
            {/* Listening Overlay */}
            {isListening && (
                <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(45,90,39,0.5)]">
                        <Mic size={48} className="text-white" />
                    </div>
                    <h2 className="mt-8 text-[20pt] font-black uppercase text-white tracking-widest animate-bounce">Listening...</h2>
                    <p className="mt-2 text-white/60 font-bold uppercase tracking-widest text-[10pt]">Release to Ask</p>
                </div>
            )}

            {/* Floating Toggle Button - NOW HOLD TO ASK */}
            <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-black text-white shadow-3xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-90 border-4 border-white select-none ${isOpen ? 'scale-0 opacity-0 translate-y-10' : 'scale-100 opacity-100 translate-y-0'}`}
                style={{ touchAction: 'none' }}
            >
                <div className="relative mb-1">
                    <Mic size={28} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-black animate-pulse" />
                </div>
                <span className="text-[7pt] font-black uppercase tracking-tighter opacity-70">HOLD TO ASK</span>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-6 right-6 z-[100] w-[90vw] sm:w-[500px] h-[75vh] sm:h-[700px] bg-white rounded-[3rem] shadow-4xl border-2 border-black flex flex-col overflow-hidden transition-all duration-500 ease-spring ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-black text-white p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg">
                            <Bot size={28} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-[16pt] font-black uppercase tracking-tight">Chu Health Bot</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-[9pt] font-bold opacity-60 uppercase tracking-widest">Live Specialist</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Messages Hub */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-gray-50/50">
                    <div className="flex flex-col gap-5">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[88%] p-5 rounded-[1.8rem] flex gap-4 ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none shadow-xl' : 'bg-white border-2 border-gray-100 shadow-sm rounded-tl-none'}`}>
                                    {msg.role === 'bot' && (
                                        <div className="shrink-0 mt-1">
                                            <Sparkles size={18} className="text-primary" />
                                        </div>
                                    )}
                                    <p className="text-[12pt] font-bold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white border-t border-gray-100">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me something else..."
                            className="w-full bg-gray-100 rounded-[1.5rem] p-5 pr-16 text-[12pt] font-bold outline-none border-2 border-transparent focus:border-black transition-all"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-2.5 top-2.5 w-11 h-11 bg-black text-white rounded-[1rem] flex items-center justify-center hover:bg-primary transition-all active:scale-95 shadow-md"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <p className="text-[8pt] text-gray-400 font-bold uppercase tracking-widest">Powered by Antigravity AI Voice</p>
                    </div>
                </div>

            </div>
        </>
    );
}
