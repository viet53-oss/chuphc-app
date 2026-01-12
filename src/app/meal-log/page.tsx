'use client';

import {
    Plus,
    ChevronRight,
    ChevronLeft,
    Camera,
    Star,
    Clock
} from 'lucide-react';
import { useState } from 'react';

export default function MealLog() {
    const [rating, setRating] = useState(0);

    return (
        <div className="fade-in flex flex-col w-full pb-24">

            {/* SECTION 1: HEADER (Standard Home Header Structure) */}
            <section className="app-section flex flex-col gap-2 !border-black !bg-primary-tint">
                <span className="text-small text-primary">Nutrition Module</span>
                <h1 className="title-xl">Meal Log</h1>
                <div className="flex items-center gap-2 mt-2">
                    <Clock size={14} className="text-primary" />
                    <span className="text-small opacity-60">Last entry: Today, 12:30 PM</span>
                </div>
            </section>

            {/* SECTION 2: FAST LOG (Primary Action) */}
            <section className="app-section !border-black">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h2 className="title-md">Record Meal</h2>
                        <div className="flex items-center gap-2">
                            <button className="p-2 border-2 border-black/5 rounded-xl"><ChevronLeft size={16} /></button>
                            <span className="text-small">Jan 11</span>
                            <button className="p-2 border-2 border-black/5 rounded-xl"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <button className="w-full aspect-video border-2 border-dashed border-black/10 rounded-3xl flex flex-col items-center justify-center gap-2 bg-black/5 text-muted hover:bg-black/10 transition-colors">
                        <Camera size={32} />
                        <span className="text-small">Tap to add photo</span>
                    </button>

                    <div className="flex flex-col gap-3">
                        <label className="text-small opacity-60">Meal Quality</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setRating(s)}
                                    className={`p-3 rounded-2xl border-2 transition-all ${rating >= s ? 'border-black bg-primary-tint text-primary' : 'border-black/5'}`}
                                >
                                    <Star size={20} fill={rating >= s ? 'currentColor' : 'none'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="btn-primary w-full shadow-lg !rounded-3xl hover:scale-[0.98] active:scale-95 transition-all">
                        Save Entry <Plus size={20} />
                    </button>
                </div>
            </section>

            {/* SECTION 3: RECENT SUMMARY (Horizontal History) */}
            <section className="flex flex-col gap-4">
                <h2 className="title-md ml-2">Recent Logs</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-6">
                    {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                        <div key={meal} className="app-section !mb-0 shrink-0 w-48 border-black bg-white">
                            <span className="text-small text-primary">{meal}</span>
                            <h3 className="title-md mt-1">On Track</h3>
                            <p className="text-body opacity-60 mt-2">12:30 PM</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
