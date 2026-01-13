'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, X, Mic, Volume2, VolumeX, Send, Download, Trash2 } from 'lucide-react';
import { colors, spacing, fontSize } from '@/lib/design-system';

import { getGeminiResponse } from '@/app/chat-actions';

export default function GlobalChat() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string; created_at?: string }>>([
        { role: 'bot', content: "Hello! I'm your Chu Health Assistant. Ask me anything about your health!" }
    ]);
    const [textInput, setTextInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const { user, loading } = useAuth();
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom (newest messages)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

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
            .order('created_at', { ascending: true }); // Load in chronological order

        if (data) {
            const formattedMessages = data.map(msg => ({
                role: msg.role,
                content: msg.content,
                created_at: msg.created_at
            }));
            if (formattedMessages.length > 0) {
                setChatMessages(formattedMessages);
            } else {
                // Reset to default if no history found for this user
                setChatMessages([
                    { role: 'bot', content: "Hello! I'm your Chu Health Assistant. Ask me anything about your health!" }
                ]);
            }
        }
    };

    const saveChatMessage = async (role: string, content: string): Promise<boolean> => {
        // Get current user directly from Supabase to avoid closure issues
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
            console.error('[saveChatMessage] No user found');
            return false;
        }

        console.log(`[saveChatMessage] Saving ${role} message:`, content.substring(0, 50));
        console.log(`[saveChatMessage] User ID:`, currentUser.id);

        const { data, error } = await supabase
            .from('chat_messages')
            .insert([{
                user_id: currentUser.id,
                role,
                content
                // Let DB handle created_at with DEFAULT NOW()
            }])
            .select() // Return the inserted row to verify success
            .single();

        if (error) {
            console.error('[saveChatMessage] Failed to save:', error);
            console.error('[saveChatMessage] Error details:', {
                message: error.message,
                code: error.code,
                hint: error.hint,
                details: error.details
            });
            // Visual feedback for debugging
            setChatMessages(prev => [...prev, {
                role: 'bot',
                content: `⚠️ System Error: Failed to save message. Reason: ${error.message || error.code || 'Unknown'}`
            }]);
            return false;
        }

        if (!data) {
            console.error('Message saved but no data returned. RLS might be blocking read.');
            // Optionally warn user, but usually if error is null and data is null, something weird happened.
            // But valid insert usually returns data if .select() is used.
            return false;
        }

        console.log('[saveChatMessage] Successfully saved message with ID:', data.id);
        return true;
    };

    const handleVoiceInput = async (text: string) => {
        if (!text.trim()) return;

        console.log('[handleVoiceInput] Processing message:', text);

        const userMessage = { role: 'user', content: text };
        setChatMessages(prev => [...prev, userMessage]);
        const userSaved = await saveChatMessage('user', text);
        console.log('[handleVoiceInput] User message saved:', userSaved);



        const clientData = await fetchClientData();

        // 1. Check for specific actions (Add/Update/Delete)
        const actionResult = await executeAction(text, clientData);

        let responseText = '';

        if (actionResult) {
            console.log('[handleVoiceInput] Action result:', actionResult.substring(0, 50));
            responseText = actionResult;
        } else {
            // 2. Check for simple local lookups (Date/Time) to save API calls
            const lowerQuery = text.toLowerCase();
            if (lowerQuery.includes('date') || lowerQuery.includes('what day')) {
                console.log('[handleVoiceInput] Using local date response');
                responseText = `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
            }
            else if (lowerQuery.includes('time') && (lowerQuery.includes('what') || lowerQuery.includes('current'))) {
                console.log('[handleVoiceInput] Using local time response');
                responseText = `It is currently ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`;
            }
            else {
                // 3. Fallback to Gemini AI for everything else (Health questions, summaries, small talk)
                console.log('[handleVoiceInput] Calling Gemini API');
                setIsListening(true); // Keep "listening" visual state or show "thinking" state if we had one
                try {
                    responseText = await getGeminiResponse(text, clientData);
                    console.log('[handleVoiceInput] Gemini response received:', responseText.substring(0, 50));
                } catch (e) {
                    console.error('[handleVoiceInput] Gemini error:', e);
                    responseText = "I'm having trouble thinking right now. Please try again.";
                }
                setIsListening(false);
            }
        }

        console.log('[handleVoiceInput] Final response text:', responseText.substring(0, 50));
        const botResponse = { role: 'bot', content: responseText };
        setChatMessages(prev => [...prev, botResponse]);
        const botSaved = await saveChatMessage('bot', botResponse.content);
        console.log('[handleVoiceInput] Bot response saved:', botSaved);

        speakResponse(responseText);
    };

    const executeAction = async (query: string, data: any): Promise<string | null> => {
        if (!user) return null;
        const userId = user.id; // Capture ID to satisfy TS narrowing across async boundaries

        const lowerQuery = query.toLowerCase();

        // ADD/LOG actions
        if (lowerQuery.includes('add') || lowerQuery.includes('log') || lowerQuery.includes('record')) {
            // Handle 'Log Out' exception
            if (lowerQuery.includes('logout') || lowerQuery.includes('log out')) return null;

            // Check for Goals first
            if (lowerQuery.includes('goal')) {
                const { error } = await supabase.from('goals').insert({
                    user_id: userId,
                    category: 'General',
                    title: query.replace(/add|log|record|goal/gi, '').trim(),
                    start_date: new Date().toISOString().split('T')[0]
                });

                if (error) return `Sorry, I couldn't set that goal: ${error.message}`;
                return `✅ Successfully set new goal!`;
            }

            // Default to Food/Meal Logging for other "add/log" commands
            // (e.g. "Log many banana", "Add 500 cal sandwich")
            let mealType = 'Snack';
            if (lowerQuery.includes('breakfast')) mealType = 'Breakfast';
            else if (lowerQuery.includes('lunch')) mealType = 'Lunch';
            else if (lowerQuery.includes('dinner')) mealType = 'Dinner';

            const calorieMatch = query.match(/(\d+)\s*(cal|calorie)/i);
            const calories = calorieMatch ? parseInt(calorieMatch[1]) : 0;

            const { error } = await supabase.from('nutrition_logs').insert({
                user_id: userId,
                meal_type: mealType,
                calories: calories,
                notes: JSON.stringify({ items: [query.replace(/add|log|record/gi, '').trim()] }),
                logged_at: new Date().toISOString()
            });

            if (error) return `Sorry, I couldn't log that meal: ${error.message}`;
            return `✅ Successfully logged ${mealType} (${calories} cal)!`;
        }

        // DELETE/REMOVE actions
        if (lowerQuery.includes('delete') || lowerQuery.includes('remove')) {
            if (lowerQuery.includes('last') || lowerQuery.includes('recent')) {
                if (lowerQuery.includes('meal') || lowerQuery.includes('food')) {
                    const lastMeal = data.nutrition?.allLogs?.[0];
                    if (lastMeal) {
                        const { error } = await supabase.from('nutrition_logs').delete().eq('id', lastMeal.id);
                        if (error) return `Sorry, I couldn't delete that: ${error.message}`;
                        return `✅ Deleted last meal (${lastMeal.meal_type}, ${lastMeal.calories} calories)`;
                    }
                    return "You don't have any meals to delete.";
                }

                if (lowerQuery.includes('activity') || lowerQuery.includes('workout')) {
                    const lastActivity = data.activity?.[0];
                    if (lastActivity) {
                        const { error } = await supabase.from('activity_logs').delete().eq('id', lastActivity.id);
                        if (error) return `Sorry, I couldn't delete that: ${error.message}`;
                        return `✅ Deleted last activity`;
                    }
                    return "You don't have any activities to delete.";
                }
            }
        }

        // UPDATE actions
        if (lowerQuery.includes('update') || lowerQuery.includes('change') || lowerQuery.includes('edit') || lowerQuery.includes('complete')) {
            if (lowerQuery.includes('goal')) {
                const lastGoal = data.goals?.find((g: any) => !g.completed);
                if (lastGoal) {
                    const { error } = await supabase.from('goals').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', lastGoal.id);
                    if (error) return `Sorry, I couldn't update that: ${error.message}`;
                    return `✅ Marked goal "${lastGoal.title}" as completed! 🎉`;
                }
                return "You don't have any active goals to complete.";
            }
        }

        return null;
    };

    const fetchClientData = async () => {
        if (!user) return {};

        try {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
            const { data: nutritionLogs } = await supabase.from('nutrition_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false });
            const { data: activityLogs } = await supabase.from('activity_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false });
            const { data: sleepLogs } = await supabase.from('sleep_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            const { data: stressLogs } = await supabase.from('stress_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false });
            const { data: socialLogs } = await supabase.from('social_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false });
            const { data: substanceLogs } = await supabase.from('substance_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false });
            const { data: goals } = await supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            const { data: settings } = await supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle();
            const { data: memberProfile } = await supabase.from('members').select('*').eq('id', user.id).maybeSingle();

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayLogs = nutritionLogs?.filter(log => new Date(log.logged_at) >= today) || [];
            const totalCaloriesToday = todayLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
            const mealsLoggedToday = todayLogs.length;

            return {
                profile: {
                    email: profile?.email || user.email,
                    fullName: profile?.full_name,
                    firstName: profile?.first_name || memberProfile?.first_name,
                    lastName: profile?.last_name || memberProfile?.last_name,
                    dateOfBirth: profile?.date_of_birth,
                    phone: profile?.phone || memberProfile?.phone,
                    address: memberProfile?.address,
                    city: memberProfile?.city,
                    state: memberProfile?.state,
                    zip: memberProfile?.zip,
                    precisionScore: profile?.precision_score,
                    tier: profile?.tier,
                    achievementPoints: profile?.achievement_points
                },
                nutrition: {
                    totalCaloriesToday,
                    mealsLoggedToday,
                    recentLogs: todayLogs.map(log => ({
                        mealType: log.meal_type,
                        calories: log.calories,
                        protein: log.protein,
                        carbs: log.carbs,
                        fats: log.fats,
                        time: new Date(log.logged_at).toLocaleTimeString(),
                        notes: log.notes ? JSON.parse(log.notes) : {}
                    })),
                    allLogs: nutritionLogs
                },
                activity: activityLogs || [],
                sleep: sleepLogs || [],
                stress: stressLogs || [],
                social: socialLogs || [],
                substance: substanceLogs || [],
                goals: goals || [],
                settings: settings || {}
            };
        } catch (error) {
            console.error('Error fetching client data:', error);
            return {};
        }
    };

    const generateResponseWithData = (query: string, data: any) => {
        const lowerQuery = query.toLowerCase();

        // Check for specific food item queries first

        // 1. Common Sense & Utility Questions
        if (lowerQuery.includes('date') || lowerQuery.includes('what day')) {
            return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
        }

        if (lowerQuery.includes('time') && (lowerQuery.includes('what') || lowerQuery.includes('current'))) {
            return `It is currently ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`;
        }

        if (lowerQuery === 'hello' || lowerQuery === 'hi' || lowerQuery === 'hey' || lowerQuery.startsWith('hello ') || lowerQuery.startsWith('hi ')) {
            return "Hello! 👋 I'm your Chu Health Assistant. How can I help you achieve your wellness goals today?";
        }

        if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
            return "I can help you track and manage your health! \n\nTry asking me:\n• 'What did I eat today?'\n• 'Log a 500 calorie ham sandwich for lunch'\n• 'How is my sleep?'\n• 'Show my profile'";
        }

        if (data.nutrition?.recentLogs && data.nutrition.recentLogs.length > 0) {
            // Extract potential food item from query (remove common words)
            const foodQuery = lowerQuery
                .replace(/do i like|did i eat|have i eaten|when did i eat|last time i had|i like|i eat/gi, '')
                .replace(/\?/g, '')
                .trim();

            // Search for the food item in all meals
            const mealsWithItem: any[] = [];
            data.nutrition.recentLogs.forEach((log: any) => {
                if (log.notes && log.notes.items && log.notes.items.length > 0) {
                    const matchingItems = log.notes.items.filter((item: string) =>
                        item.toLowerCase().includes(foodQuery) || foodQuery.includes(item.toLowerCase())
                    );
                    if (matchingItems.length > 0) {
                        mealsWithItem.push({ ...log, matchingItems });
                    }
                }
            });

            // If we found specific food items, return targeted response
            if (mealsWithItem.length > 0 && foodQuery.length > 2) {
                const mostRecent = mealsWithItem[0];
                let response = `Yes! You had ${mostRecent.matchingItems.join(', ')} for ${mostRecent.mealType} at ${mostRecent.time} (${mostRecent.calories} calories).`;

                if (mealsWithItem.length > 1) {
                    response += `\n\nYou've eaten this ${mealsWithItem.length} time(s) today.`;
                }

                return response;
            }
        }

        // General nutrition queries
        if (lowerQuery.includes('calorie') || lowerQuery.includes('eat') || lowerQuery.includes('meal') || lowerQuery.includes('food') || lowerQuery.includes('breakfast') || lowerQuery.includes('lunch') || lowerQuery.includes('dinner') || lowerQuery.includes('snack')) {
            if (data.nutrition?.totalCaloriesToday > 0) {
                let response = `Today you've consumed ${data.nutrition.totalCaloriesToday} calories across ${data.nutrition.mealsLoggedToday} meal(s). `;

                if (data.nutrition.recentLogs && data.nutrition.recentLogs.length > 0) {
                    response += "\n\nHere's what you ate today:\n";
                    data.nutrition.recentLogs.forEach((log: any, index: number) => {
                        response += `\n${index + 1}. ${log.mealType} (${log.time})`;
                        if (log.notes && log.notes.items && log.notes.items.length > 0) {
                            response += `:\n   • ${log.notes.items.join('\n   • ')}`;
                        }
                        response += `\n   Calories: ${log.calories}`;
                    });
                }

                return response;
            }
            return "You haven't logged any meals today yet. Would you like to track your nutrition?";
        }

        if (lowerQuery.includes('activity') || lowerQuery.includes('exercise') || lowerQuery.includes('workout')) {
            if (data.activity?.length > 0) {
                const recentActivity = data.activity[0];
                return `Your most recent activity was logged on ${new Date(recentActivity.logged_at).toLocaleDateString()}. You have ${data.activity.length} activity entries in your history.`;
            }
            return "You haven't logged any activities yet. Start tracking your workouts!";
        }

        if (lowerQuery.includes('sleep') || lowerQuery.includes('rest')) {
            if (data.sleep?.length > 0) {
                const recentSleep = data.sleep[0];
                return `Your most recent sleep log was on ${new Date(recentSleep.created_at).toLocaleDateString()}. You have ${data.sleep.length} sleep entries tracked.`;
            }
            return "You haven't logged any sleep data yet. Track your sleep for better insights!";
        }

        if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety') || lowerQuery.includes('mood')) {
            if (data.stress?.length > 0) {
                const recentStress = data.stress[0];
                return `Your most recent stress log was on ${new Date(recentStress.logged_at).toLocaleDateString()}. You have ${data.stress.length} stress entries recorded.`;
            }
            return "You haven't logged any stress data yet. Track your stress levels for better mental health!";
        }

        if (lowerQuery.includes('social') || lowerQuery.includes('friend') || lowerQuery.includes('interaction')) {
            if (data.social?.length > 0) {
                const recentSocial = data.social[0];
                return `Your most recent social activity was ${recentSocial.activity_type} logged on ${new Date(recentSocial.logged_at).toLocaleDateString()}. You have ${data.social.length} social interactions recorded.`;
            }
            return "You haven't logged any social activities yet. Track your social interactions for better insights!";
        }

        if (lowerQuery.includes('substance') || lowerQuery.includes('alcohol') || lowerQuery.includes('smoking') || lowerQuery.includes('risky')) {
            if (data.substance?.length > 0) {
                const recentSubstance = data.substance[0];
                return `Your most recent substance log was ${recentSubstance.substance_type} on ${new Date(recentSubstance.logged_at).toLocaleDateString()}. You have ${data.substance.length} entries tracked.`;
            }
            return "You haven't logged any substance use. Track risky behaviors for better health awareness.";
        }

        if (lowerQuery.includes('goal') || lowerQuery.includes('target') || lowerQuery.includes('progress')) {
            if (data.goals?.length > 0) {
                const activeGoals = data.goals.filter((g: any) => !g.completed);
                const completedGoals = data.goals.filter((g: any) => g.completed);
                let response = `You have ${activeGoals.length} active goal(s) and ${completedGoals.length} completed goal(s).`;
                if (activeGoals.length > 0) {
                    response += "\n\nActive Goals:\n";
                    activeGoals.slice(0, 5).forEach((goal: any, i: number) => {
                        response += `\n${i + 1}. ${goal.title} (${goal.category})`;
                        if (goal.target_value) {
                            response += `\n   Progress: ${goal.current_value || 0}/${goal.target_value} ${goal.unit || ''}`;
                        }
                    });
                }
                return response;
            }
            return "You haven't set any goals yet. Set health goals to track your progress!";
        }

        if (lowerQuery.includes('profile') || lowerQuery.includes('info') || lowerQuery.includes('name') || lowerQuery.includes('score') || lowerQuery.includes('tier')) {
            if (data.profile?.firstName) {
                let response = `Your profile:\n• Name: ${data.profile.firstName} ${data.profile.lastName || ''}\n• Email: ${data.profile.email}`;
                if (data.profile.precisionScore !== undefined) {
                    response += `\n• Precision Score: ${data.profile.precisionScore}`;
                }
                if (data.profile.tier) {
                    response += `\n• Tier: ${data.profile.tier}`;
                }
                if (data.profile.achievementPoints) {
                    response += `\n• Achievement Points: ${data.profile.achievementPoints}`;
                }
                if (data.profile.city) {
                    response += `\n• Location: ${data.profile.city}, ${data.profile.state}`;
                }
                return response;
            }
            return "I can help you with your profile information. What would you like to know?";
        }

        if (lowerQuery.includes('recent') || lowerQuery.includes('today') || lowerQuery.includes('latest')) {
            if (data.nutrition?.recentLogs?.length > 0) {
                const lastMeal = data.nutrition.recentLogs[0];
                return `Your most recent meal was ${lastMeal.mealType} at ${lastMeal.time}, with ${lastMeal.calories} calories.`;
            }
            return "You haven't logged any meals today. Start tracking to see your progress!";
        }

        if (lowerQuery.includes('summary') || lowerQuery.includes('overview') || lowerQuery.includes('status') || lowerQuery.includes('everything')) {
            let summary = "📊 Complete Health Summary:\n\n";
            summary += `🍽️ Nutrition: ${data.nutrition?.totalCaloriesToday || 0} calories today (${data.nutrition?.mealsLoggedToday || 0} meals)\n`;
            summary += `🏃 Activity: ${data.activity?.length || 0} workouts logged\n`;
            summary += `😴 Sleep: ${data.sleep?.length || 0} sleep entries\n`;
            summary += `😰 Stress: ${data.stress?.length || 0} stress logs\n`;
            summary += `👥 Social: ${data.social?.length || 0} social interactions\n`;
            summary += `⚠️ Substance: ${data.substance?.length || 0} substance logs\n`;
            summary += `🎯 Goals: ${data.goals?.filter((g: any) => !g.completed).length || 0} active, ${data.goals?.filter((g: any) => g.completed).length || 0} completed\n`;
            if (data.profile?.precisionScore !== undefined) {
                summary += `\n⭐ Precision Score: ${data.profile.precisionScore}`;
            }
            if (data.profile?.tier) {
                summary += `\n🏆 Tier: ${data.profile.tier}`;
            }
            return summary;
        }

        return "I'm here to help! You can ask me about your calories, meals, activity, sleep, stress, social interactions, substance use, goals, profile, or get a complete summary. I can also add, update, or delete data for you!";
    };

    const speakResponse = (text: string) => {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
    };

    const exportChat = () => {
        const chatText = chatMessages.map(msg =>
            `[${msg.role.toUpperCase()}]: ${msg.content}`
        ).join('\n\n');

        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chu-health-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearChatHistory = async () => {
        if (!confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
            return;
        }

        console.log('[clearChatHistory] Starting clear operation');

        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
            console.error('[clearChatHistory] No user found');
            return;
        }

        console.log('[clearChatHistory] User ID:', currentUser.id);

        // Delete all chat messages for this user
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('user_id', currentUser.id);

        if (error) {
            console.error('[clearChatHistory] Failed to clear:', error);
            console.error('[clearChatHistory] Error details:', {
                message: error.message,
                code: error.code,
                hint: error.hint,
                details: error.details
            });
            setChatMessages(prev => [...prev, {
                role: 'bot',
                content: `⚠️ Failed to clear chat history: ${error.message || error.code || 'Unknown error'}`
            }]);
        } else {
            // Reset to default welcome message
            setChatMessages([{
                role: 'bot',
                content: "Hello! I'm your Chu Health Assistant. Ask me anything about your health!"
            }]);
            console.log('[clearChatHistory] Chat history cleared successfully');
        }
    };

    const handleQuickAction = (action: string) => {
        handleVoiceInput(action);
    };

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

    const handleTextSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (textInput.trim()) {
            handleVoiceInput(textInput);
            setTextInput('');
        }
    };

    // Don't show chat while auth is loading or if user is not authenticated
    if (loading || !user) return null;

    return (
        <>
            {!isChatOpen && (
                <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
                    <button onClick={() => setIsChatOpen(true)} style={{ width: '4rem', height: '4rem', backgroundColor: 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: 'none', cursor: 'pointer' }}>
                        <MessageCircle color="white" size={32} />
                    </button>
                </div>
            )}

            {isChatOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: spacing.xs }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: spacing.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid black', backgroundColor: colors.white }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: colors.green, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MessageCircle size={18} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: fontSize.base, fontWeight: 'bold' }}>Chu Assistant</h3>
                                    <span style={{ fontSize: fontSize.xs, color: colors.green, fontWeight: 'bold' }}>● Online</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
                                <button onClick={() => setVoiceEnabled(!voiceEnabled)} style={{ backgroundColor: voiceEnabled ? colors.green : colors.gray, color: 'white', borderRadius: '50%', padding: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={voiceEnabled ? "Voice On" : "Voice Off"}>
                                    {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                </button>
                                <button onClick={exportChat} style={{ backgroundColor: colors.black, color: 'white', borderRadius: '50%', padding: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Export Chat">
                                    <Download size={20} />
                                </button>
                                <button onClick={clearChatHistory} style={{ backgroundColor: colors.red, color: 'white', borderRadius: '50%', padding: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Clear Chat History">
                                    <Trash2 size={20} />
                                </button>
                                <button onClick={() => setIsChatOpen(false)} style={{ backgroundColor: 'black', color: 'white', borderRadius: '9999px', padding: '8px 16px', fontWeight: 'bold', fontSize: fontSize.sm, border: 'none', cursor: 'pointer' }}>
                                    CLOSE
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.md, backgroundColor: '#f9fafb' }}>
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: spacing.md, borderRadius: '16px', borderTopRightRadius: msg.role === 'user' ? '4px' : '16px', borderTopLeftRadius: msg.role === 'bot' ? '4px' : '16px', backgroundColor: msg.role === 'user' ? colors.black : colors.white, color: msg.role === 'user' ? colors.white : colors.black, border: msg.role === 'bot' ? '2px solid black' : 'none', fontSize: fontSize.base, whiteSpace: 'pre-wrap' }}>
                                    {msg.content}
                                </div>
                            ))}
                            {isListening && (
                                <div style={{ alignSelf: 'flex-end', padding: spacing.md, fontStyle: 'italic', color: colors.gray }}>
                                    Listening...
                                </div>
                            )}

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md, justifyContent: 'center' }}>
                                {["Today's calories", "What was my last meal?", "Health summary"].map((action) => (
                                    <button key={action} onClick={() => handleQuickAction(action)} style={{ padding: '8px 16px', backgroundColor: colors.white, color: colors.black, border: '2px solid black', borderRadius: '9999px', fontSize: '12pt', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.black; e.currentTarget.style.color = colors.white; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.white; e.currentTarget.style.color = colors.black; }}>
                                        {action}
                                    </button>
                                ))}
                            </div>
                            <div ref={messagesEndRef} />
                        </div>

                        <div style={{ padding: spacing.lg, borderTop: '2px solid black', borderBottom: '2px solid black', backgroundColor: colors.white }}>
                            <form onSubmit={handleTextSubmit} style={{ width: '100%', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type your question..." style={{ flex: 1, minWidth: 0, padding: '12px 16px', border: '2px solid black', borderRadius: '9999px', fontSize: '14pt', outline: 'none' }} />
                                <button type="submit" style={{ padding: '12px 16px', backgroundColor: colors.black, color: colors.white, border: 'none', borderRadius: '9999px', fontSize: '14pt', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>
                                    Send
                                </button>
                                <button type="button" onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: isListening ? colors.red : colors.black, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'transform 0.1s', transform: isListening ? 'scale(1.1)' : 'scale(1)', flexShrink: 0 }} title={isListening ? 'Release to Send' : 'Hold to Speak'}>
                                    <Mic size={24} color="white" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
