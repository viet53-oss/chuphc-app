'use client';

import { useState } from 'react';
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
    Moon
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
    const [showForm, setShowForm] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState('Breakfast');
    const [mealType, setMealType] = useState('Breakfast');
    const [mood, setMood] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [rating, setRating] = useState(0);
    const [eatingSpeed, setEatingSpeed] = useState('');
    const [comment, setComment] = useState('');

    const toggleItem = (item: string) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert("This feature is currently UI-only. Backend integration coming soon!");
        // Placeholder for future submission logic
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-3 w-full animate-fade-in pb-20">

                {/* Header / Tabs */}
                <div className="bg-white border-b-2 border-black sticky top-[70px] z-40">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-300">
                        <div className="flex gap-2">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-small font-bold">TRACK</button>
                            <button className="text-gray-500 px-3 py-1 text-small font-bold">FOOD RX</button>
                            <button className="text-gray-500 px-3 py-1 text-small font-bold">LOG</button>
                        </div>
                    </div>

                    <div className="p-4 flex justify-center border-b border-gray-200">
                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border border-gray-300 px-3 py-1 rounded font-bold text-center"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2 overflow-x-auto">
                        {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 font-bold text-sm ${activeTab === tab ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                            >
                                {tab}
                            </button>
                        ))}
                        <button className="p-2 text-blue-500">
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* Main Form Content */}
                <div className="p-4 bg-white min-h-screen">
                    <div className="bg-gray-600 text-white p-2 font-bold mb-6">
                        Record Meal
                    </div>

                    {/* Picture */}
                    <div className="mb-8 text-center">
                        <h3 className="font-bold text-red-500 mb-4">Picture(s)*</h3>
                        <button className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                            <Camera size={40} className="text-blue-400" />
                        </button>
                    </div>

                    <hr className="border-gray-300 mb-6" />

                    {/* Meal Type */}
                    <div className="mb-8 text-center">
                        <h3 className="font-bold text-red-500 mb-4">Meal Type*</h3>
                        <div className="flex justify-around">
                            {[
                                { name: 'Breakfast', icon: Coffee, color: '#10b981' },
                                { name: 'Lunch', icon: Soup, color: '#3b82f6' },
                                { name: 'Dinner', icon: Utensils, color: '#f59e0b' },
                                { name: 'Snack', icon: Apple, color: '#ef4444' }
                            ].map((type) => (
                                <button
                                    key={type.name}
                                    onClick={() => setMealType(type.name)}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${mealType === type.name ? 'scale-110' : 'opacity-60'}`}
                                >
                                    <type.icon size={32} style={{ color: type.color }} />
                                    <span className="text-xs font-bold">{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-300 mb-6" />

                    {/* Mood */}
                    <div className="mb-8 text-center">
                        <h3 className="font-bold text-red-500 mb-4">Mood*</h3>
                        <div className="flex justify-around flex-wrap gap-4">
                            {MOODS.map((m) => (
                                <button
                                    key={m.label}
                                    onClick={() => setMood(m.label)}
                                    className={`flex flex-col items-center gap-2 transition-all ${mood === m.label ? 'scale-110 font-bold' : 'opacity-60'}`}
                                >
                                    <m.icon size={32} style={{ color: m.color }} />
                                    <span className="text-xs">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-300 mb-6" />

                    {/* Your Meal Had */}
                    <div className="mb-8">
                        <h3 className="font-bold text-red-500 mb-4 text-center">Your meal had*</h3>
                        <p className="text-center text-xs text-gray-400 mb-4">Click all that apply</p>

                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
                            <div className="text-right">
                                <h4 className="font-bold text-sm mb-4">Meal didn't have</h4>
                                <div className="flex flex-col items-end gap-2">
                                    {MEAL_ITEMS.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => toggleItem(item)}
                                            className={`text-xs px-2 py-1 border border-gray-300 rounded-md transition-all ${selectedItems.includes(item) ? 'opacity-0 pointer-events-none' : 'bg-white hover:bg-gray-50'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 pt-10">
                                {MEAL_ITEMS.map((item) => (
                                    <div key={item} className="h-[26px] flex items-center">
                                        <div className={`w-4 h-4 rounded-full ${selectedItems.includes(item) ? 'bg-blue-500' : 'bg-cyan-400'}`}></div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-left">
                                <h4 className="font-bold text-sm mb-4">Meal had</h4>
                                <div className="flex flex-col items-start gap-2">
                                    {MEAL_ITEMS.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => toggleItem(item)}
                                            className={`text-xs px-2 py-1 font-bold text-blue-600 transition-all ${selectedItems.includes(item) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-300 mb-6" />

                    {/* Meal Rating */}
                    <div className="mb-8 text-center">
                        <h3 className="font-bold text-red-500 mb-4">Meal Rating*</h3>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)}>
                                    <Star
                                        size={32}
                                        fill={rating >= star ? "#64748b" : "none"}
                                        className={rating >= star ? "text-gray-500" : "text-gray-300"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-300 mb-6" />

                    {/* Meal Eating Speed */}
                    <div className="mb-8 text-center">
                        <h3 className="font-bold text-red-500 mb-4">Meal Eating Speed*</h3>
                        <div className="flex justify-center gap-6">
                            {['5 minutes', '10 minutes', '20 minutes'].map((speed) => (
                                <label key={speed} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="eating_speed"
                                        checked={eatingSpeed === speed}
                                        onChange={() => setEatingSpeed(speed)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm font-medium">{speed}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-300 mb-6" />

                    {/* Comment */}
                    <div className="mb-8 text-center">
                        <h3 className="font-bold text-black mb-4">Comment</h3>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="comments about your meal"
                            className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-blue-500 text-sm"
                            rows={3}
                        />
                    </div>

                    <hr className="border-gray-300 mb-6" />

                    {/* Buttons */}
                    <div className="flex justify-center gap-4 pb-10">
                        <button className="px-8 py-2 bg-blue-600 text-white font-bold rounded shadow-md hover:bg-blue-700">
                            Add
                        </button>
                        <button className="px-8 py-2 bg-gray-500 text-white font-bold rounded shadow-md hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}
