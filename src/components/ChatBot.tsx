'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { DIET_BIBLE } from '@/lib/diet-knowledge';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am your Chu Precision Health Assistant. How can I help you optimize your health today?' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input.toLowerCase();
        setInput('');

        // Find relevant diet answer
        let botResponse = DIET_BIBLE.default;

        for (const faq of DIET_BIBLE.faqs) {
            if (faq.keywords.some(keyword => currentInput.includes(keyword))) {
                botResponse = faq.answer;
                break;
            }
        }

        // Handle generic "rules" or "bible" request
        if (currentInput.includes('rule') || currentInput.includes('bible') || currentInput.includes('guide')) {
            botResponse = "Here are our core metabolic rules:\n\n" + DIET_BIBLE.principles.join("\n\n");
        }

        // Simulate bot response
        setTimeout(() => {
            const botMsg = {
                role: 'bot',
                content: botResponse
            };
            setMessages(prev => [...prev, botMsg]);
        }, 800);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-black text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <div className="relative">
                    <MessageSquare size={30} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-black animate-pulse" />
                </div>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-6 right-6 z-[100] w-[90vw] sm:w-[400px] h-[70vh] sm:h-[600px] bg-white rounded-[2.5rem] shadow-3xl border-2 border-black flex flex-col overflow-hidden transition-all duration-500 ease-spring ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-black text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-[14pt] font-black uppercase tracking-tight">Chu Assistant</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-[8pt] font-bold opacity-60 uppercase tracking-widest">Always Active</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Hub */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/50">
                    <div className="flex flex-col gap-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white border border-gray-100 shadow-sm rounded-tl-none'}`}>
                                    {msg.role === 'bot' && <Sparkles size={16} className="text-primary mt-1 shrink-0" />}
                                    <p className="text-[11pt] font-bold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-100">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="w-full bg-gray-100 rounded-2xl p-4 pr-14 text-[11pt] font-bold outline-none border-2 border-transparent focus:border-black transition-all"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-2 top-2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-primary transition-all active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[8pt] text-center mt-3 text-gray-400 font-bold uppercase tracking-widest">Powered by Antigravity AI</p>
                </div>

            </div>
        </>
    );
}
