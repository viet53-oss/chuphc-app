'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
    Camera,
    Utensils,
    Coffee,
    Soup,
    Apple,
    Smile,
    Meh,
    Frown,
    Star,
    Plus,
    X,
    Calendar,
    CloudRain,
    Zap,
    Moon,
    ChevronRight,
    TrendingUp
} from 'lucide-react';

const MEAL_ITEMS = [
    'Whole Grains', 'Refined Carbs', 'Plant Proteins', 'Red Meat',
    'Poultry / Fish', 'Eggs', 'Milk / Cheese / Yogurt', 'Plant Milk',
    'Fat', 'Nuts, Seeds', 'Starchy Veggies (1 to 2 cups)',
    'Veggies (1 to 2 cups)', 'Veggies (3 to 4 cups)', 'Avocado',
    'Fruits', 'Creamy Dressings', 'Vegan processed food', 'Sweeteners',
    'Cookie, Ice Cream, Chips', 'Chocolate', 'Tea, Coffee',
    'Juice / Sweet Drinks / Sports Drinks', 'Smoothies',
    'Protein Powder Shake', 'Water', 'Unsweetened Beverage',
    'Alcohol', 'No Oil Cooking', 'Outside Meal'
];

const MOODS = [
    { label: 'Happy', icon: Smile, color: '#10b981' },
    { label: 'Confident', icon: Zap, color: '#f59e0b' },
    { label: 'Tired', icon: CloudRain, color: '#64748b' },
    { label: 'Sleepy', icon: Moon, color: '#8b5cf6' },
    { label: 'Stressed', icon: Frown, color: '#ef4444' },
    { label: 'Neutral', icon: Meh, color: '#94a3b8' },
];

export default function NutritionPage() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recentLogs, setRecentLogs] = useState<any[]>([]);

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mealType, setMealType] = useState('Breakfast');
    const [mood, setMood] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [rating, setRating] = useState(0);
    const [eatingSpeed, setEatingSpeed] = useState('');
    const [comment, setComment] = useState('');

    // Fetch recent logs
    const fetchLogs = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('nutrition_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('logged_at', { ascending: false })
            .limit(5);

        if (!error && data) {
            setRecentLogs(data);
        } else if (error) {
            console.error("Error fetching nutrition logs:", error);
        }
    };

    // Load logs on mount
    useEffect(() => {
        if (user) {
            fetchLogs();
        }
    }, [user]);

    const toggleItem = (item: string) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleLogMeal = () => {
        setIsModalOpen(true);
    };

    const closeLog = () => {
        setIsModalOpen(false);
        // Optionally reset form state when closing without submitting
        setMood('');
        setSelectedItems([]);
        setRating(0);
        setEatingSpeed('');
        setComment('');
        setMealType('Breakfast'); // Reset meal type as well
        setDate(new Date().toISOString().split('T')[0]); // Reset date
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (!user) {
            alert("You must be logged in to log a meal.");
            return;
        }
        if (!mealType || !mood || rating === 0) {
            alert("Please complete all required fields (Meal Type, Mood, Rating)");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('nutrition_logs').insert([
                {
                    user_id: user.id,
                    meal_type: mealType.toLowerCase(),
                    logged_at: date,
                    mood: mood,
                    food_profile: selectedItems,
                    rating: rating,
                    eating_speed: eatingSpeed,
                    notes: comment
                },
            ]);

            if (error) throw error;

            alert("Success! Your meal has been logged.");
            setIsModalOpen(false);

            // Reset form
            setMood('');
            setSelectedItems([]);
            setRating(0);
            setEatingSpeed('');
            setComment('');
            setMealType('Breakfast'); // Reset meal type as well
            setDate(new Date().toISOString().split('T')[0]); // Reset date

            // Refresh list
            fetchLogs();
        } catch (error: any) {
            console.error(error);
            alert("Logging failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-4 w-full animate-fade-in pb-24">

                {/* Dashboard Summary Card */}
                <section className="app-section bg-gradient-to-br from-[#10b981] to-[#059669] !border-none text-white p-6 px-1 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Apple size={20} />
                            <span className="text-small font-bold uppercase tracking-widest opacity-80">Nutrition Summary</span>
                        </div>
                        <h2 className="text-[28pt] font-black leading-tight mb-4">Precision Food Fuel</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase">Today's Cal</p>
                                <p className="text-[18pt] font-black">1,420</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10pt] font-bold opacity-80 uppercase">Meals</p>
                                <p className="text-[18pt] font-black">{recentLogs.length} / 4</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-[-20%] right-[-10%] opacity-10 rotate-12">
                        <Apple size={200} />
                    </div>
                </section>

                {/* Main Action Area */}
                <div className="px-1">
                    <button
                        onClick={handleLogMeal}
                        className="w-full bg-black text-white p-6 rounded-[2rem] flex items-center justify-between shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#10b981] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                <Plus size={28} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[15pt] font-black uppercase tracking-tight">Log New Meal</h3>
                                <p className="text-[10pt] opacity-60 font-bold uppercase tracking-wider">Tap to record details</p>
                            </div>
                        </div>
                        <ChevronRight className="opacity-40" />
                    </button>
                </div>

                {/* Recent Meals List */}
                <div className="flex flex-col gap-3 px-1">
                    <h4 className="text-[12pt] font-black uppercase text-gray-400 tracking-widest px-1">Recent fuel History</h4>
                    {recentLogs.length === 0 ? (
                        <div className="p-10 text-center opacity-30 italic font-bold">No meals logged yet</div>
                    ) : (
                        recentLogs.map((log) => (
                            <div key={log.id} className="app-section flex items-center justify-between !p-5 !px-1 !border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-50 text-primary rounded-xl">
                                        {log.meal_type === 'breakfast' && <Coffee size={24} />}
                                        {log.meal_type === 'lunch' && <Utensils size={24} />}
                                        {log.meal_type === 'dinner' && <Utensils size={24} />}
                                        {log.meal_type === 'snack' && <Apple size={24} />}
                                    </div>
                                    <div>
                                        <p className="text-[12pt] font-black uppercase">{log.meal_type}</p>
                                        <p className="text-[10pt] opacity-50 font-bold uppercase tracking-tight">
                                            {new Date(log.logged_at).toLocaleDateString()} • {log.mood}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex gap-1">
                                        {[...Array(log.rating)].map((_, i) => (
                                            <Star key={i} size={10} fill="#10b981" className="text-[#10b981]" />
                                        ))}
                                    </div>
                                    <span className="text-[8pt] font-black text-[#10b981] uppercase">{log.eating_speed}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* MODAL POPUP - LOG MEAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in transition-all">
                        <div className="bg-white w-full sm:max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

                            {/* Modal Header */}
                            <div className="p-6 px-1 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-[20pt] font-black uppercase tracking-tighter">Record Meal</h2>
                                    <p className="text-[10pt] font-bold text-gray-400 uppercase tracking-widest">{date}</p>
                                </div>
                                <button
                                    onClick={closeLog}
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 px-1 space-y-8 no-scrollbar">

                                {/* Photo Upload Section */}
                                <div className="space-y-3">
                                    <h3 className="text-[12pt] font-black uppercase text-red-500 tracking-wider">Photo Capture*</h3>
                                    <button className="w-full h-40 bg-gray-50 border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-2 group hover:border-[#10b981] transition-all">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Camera size={32} />
                                        </div>
                                        <span className="text-[10pt] font-black uppercase text-gray-400">Add Meal Picture</span>
                                    </button>
                                </div>

                                {/* Meal Type Grid */}
                                <div className="space-y-4">
                                    <h3 className="text-[12pt] font-black uppercase text-red-500 tracking-wider">Meal Type*</h3>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            { name: 'Breakfast', icon: Coffee, color: '#10b981' },
                                            { name: 'Lunch', icon: Soup, color: '#3b82f6' },
                                            { name: 'Dinner', icon: Utensils, color: '#f59e0b' },
                                            { name: 'Snack', icon: Apple, color: '#ef4444' }
                                        ].map((item) => (
                                            <button
                                                key={item.name}
                                                onClick={() => setMealType(item.name)}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${mealType === item.name
                                                    ? 'border-blue-500 bg-blue-50/50 scale-105 shadow-md'
                                                    : 'border-transparent bg-gray-50 opacity-60'
                                                    }`}
                                            >
                                                <item.icon size={26} style={{ color: item.color }} />
                                                <span className="text-[9pt] font-black uppercase tracking-tighter">{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Mood Picker */}
                                <div className="space-y-4">
                                    <h3 className="text-[12pt] font-black uppercase text-red-500 tracking-wider">Current Mood*</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {MOODS.map((m) => (
                                            <button
                                                key={m.label}
                                                onClick={() => setMood(m.label)}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${mood === m.label
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-md transform -translate-y-1'
                                                    : 'border-transparent bg-gray-50 opacity-60'
                                                    }`}
                                            >
                                                <m.icon size={26} style={{ color: m.color }} />
                                                <span className="text-[9pt] font-black uppercase tracking-tighter">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Food Items Chips */}
                                <div className="space-y-4">
                                    <div className="flex items-baseline justify-between">
                                        <h3 className="text-[12pt] font-black uppercase text-red-500 tracking-wider">Food Profile*</h3>
                                        <span className="text-[9pt] font-bold text-gray-300 uppercase">Multi-select</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {MEAL_ITEMS.map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => toggleItem(item)}
                                                className={`px-4 py-2 rounded-xl text-[10pt] font-bold transition-all border-2 ${selectedItems.includes(item)
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg -rotate-1'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Speed Selector */}
                                <div className="space-y-4">
                                    <h3 className="text-[12pt] font-black uppercase text-red-500 tracking-wider">Eating Speed*</h3>
                                    <div className="flex flex-col gap-2">
                                        {['5 Minutes', '10 Minutes', '20 Minutes'].map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={() => setEatingSpeed(speed)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 font-black uppercase tracking-wider transition-all ${eatingSpeed === speed
                                                    ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md'
                                                    : 'border-gray-50 bg-gray-50 text-gray-400'
                                                    }`}
                                            >
                                                <span>{speed}</span>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${eatingSpeed === speed ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                                    {eatingSpeed === speed && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="space-y-4 text-center">
                                    <h3 className="text-[12pt] font-black uppercase text-red-500 tracking-wider">Meal Satisfaction*</h3>
                                    <div className="flex justify-center gap-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} onClick={() => setRating(star)} className="p-2 transition-transform active:scale-125">
                                                <Star
                                                    size={42}
                                                    fill={rating >= star ? "#10b981" : "none"}
                                                    className={rating >= star ? "text-[#10b981]" : "text-gray-200"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comments */}
                                <div className="space-y-4 pb-10 text-center">
                                    <h3 className="text-[12pt] font-black uppercase tracking-wider text-gray-400">Additional Notes</h3>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add context about your meal..."
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[11pt] font-bold focus:ring-2 focus:ring-blue-100 placeholder:text-gray-300"
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 px-1 border-t border-gray-100 bg-white grid grid-cols-2 gap-4">
                                <button
                                    onClick={closeLog}
                                    className="py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="py-4 bg-[#10b981] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Logging...' : 'Log Meal'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}



            </div>
        </ProtectedRoute >
    );
}
