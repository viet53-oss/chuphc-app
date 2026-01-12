'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, X, Mic, Volume2, VolumeX } from 'lucide-react';
import { colors, spacing, fontSize } from '@/lib/design-system';

export default function GlobalChat() {
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

    const loadChatMessages = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (data) {
            const formattedMessages = data.map(msg => ({
                role: msg.role,
                content: msg.content,
                created_at: msg.created_at
            }));
            if (formattedMessages.length > 0) {
                setChatMessages(formattedMessages);
            }
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
        // Note: In a real implementation this would likely be an API call
        // For now we'll simulate a response or use the local utility if available

        // Simulate thinking delay
        setTimeout(async () => {
            let responseText = "I'm here to help with your health journey.";

            try {
                const { getHealthAnswer } = await import('@/lib/health-knowledge');
                responseText = getHealthAnswer(text);
            } catch (e) {
                console.log("Health knowledge base not found, using default response");
            }

            const botResponse = { role: 'bot', content: responseText };
            setChatMessages(prev => [...prev, botResponse]);
            await saveChatMessage('bot', botResponse.content);
        }, 1000);
    };

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    handleVoiceInput(transcript);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

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

    if (!user) return null;

    return (
        <>
            {/* Floating Chat Button */}
            {!isChatOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 50
                }}>
                    <button
                        onClick={() => setIsChatOpen(true)}
                        style={{
                            width: '4rem',
                            height: '4rem',
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <MessageCircle color="white" size={32} />
                    </button>
                </div>
            )}

            {/* Chat Popup Overlay */}
            {isChatOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: spacing.xs
                }}>
                    {/* Chat Container */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>

                        {/* Header */}
                        <div style={{
                            padding: spacing.lg,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '2px solid black',
                            backgroundColor: colors.white
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: colors.green,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MessageCircle size={18} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: fontSize.base, fontWeight: 'bold' }}>Chu Assistant</h3>
                                    <span style={{ fontSize: fontSize.xs, color: colors.green, fontWeight: 'bold' }}>● Online</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <X size={24} color="black" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: spacing.lg,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: spacing.md,
                            backgroundColor: '#f9fafb'
                        }}>
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '80%',
                                        padding: spacing.md,
                                        borderRadius: '16px',
                                        borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                                        borderTopLeftRadius: msg.role === 'bot' ? '4px' : '16px',
                                        backgroundColor: msg.role === 'user' ? colors.black : colors.white,
                                        color: msg.role === 'user' ? colors.white : colors.black,
                                        border: msg.role === 'bot' ? '2px solid black' : 'none',
                                        fontSize: fontSize.base
                                    }}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {isListening && (
                                <div style={{ alignSelf: 'flex-end', padding: spacing.md, fontStyle: 'italic', color: colors.gray }}>
                                    Listening...
                                </div>
                            )}
                        </div>

                        {/* Controls Area */}
                        <div style={{
                            padding: spacing.lg,
                            borderTop: '2px solid black',
                            borderBottom: '2px solid black', // Separator before footer
                            backgroundColor: colors.white,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: spacing.md,
                            alignItems: 'center'
                        }}>
                            {/* Mic Button */}
                            <button
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onTouchStart={startRecording}
                                onTouchEnd={stopRecording}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: isListening ? colors.red : colors.black,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s',
                                    transform: isListening ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                <Mic size={32} color="white" />
                            </button>
                            <span style={{ fontSize: fontSize.sm, fontWeight: 'bold' }}>
                                {isListening ? 'Release to Send' : 'Hold to Speak'}
                            </span>
                        </div>

                        {/* Footer with Double Close Buttons (As requested) */}
                        <div style={{
                            padding: '24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: 'white',
                            borderTop: '1px solid #e5e7eb' // subtle separator
                        }}>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderRadius: '9999px', // rounded-full
                                    padding: '12px 24px',
                                    fontWeight: 'bold',
                                    fontSize: fontSize.base,
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                CLOSE
                            </button>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderRadius: '9999px',
                                    padding: '12px 24px',
                                    fontWeight: 'bold',
                                    fontSize: fontSize.base,
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                CLOSE
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
