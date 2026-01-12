'use client';

import { BookOpen, Search, GraduationCap, ChevronRight, PlayCircle, FileText } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const COURSES = [
    { title: 'Nutrition Fundamentals', category: 'NUTRITION', duration: '5 min read', icon: FileText, color: '#10b981' },
    { title: 'Mastering Sleep Hygiene', category: 'SLEEP', duration: '8 min read', icon: BookOpen, color: '#3b82f6' },
    { title: 'The Science of Stress', category: 'STRESS', duration: '12 min video', icon: PlayCircle, color: '#14b8a6' },
    { title: 'Active Lifestyle Basics', category: 'ACTIVITY', duration: '10 min read', icon: GraduationCap, color: '#f59e0b' },
];

export default function EducationPage() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-4 w-full animate-fade-in pb-24">

                {/* Header Card */}
                <section className="app-section bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] !border-none text-white p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen size={20} />
                            <span className="text-small font-bold uppercase tracking-widest opacity-80">Knowledge Hub</span>
                        </div>
                        <h2 className="text-[28pt] font-black leading-tight mb-4">Education Center</h2>
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3">
                            <Search size={20} className="opacity-50" />
                            <span className="text-[12pt] font-bold opacity-50 uppercase">Search health topics...</span>
                        </div>
                    </div>
                </section>

                {/* Featured Lesson */}
                <div className="app-section !p-6 bg-primary-tint border-2 border-black">
                    <h3 className="text-[12pt] font-black uppercase text-gray-400 mb-4 tracking-widest">Featured Lesson</h3>
                    <div className="space-y-2">
                        <h4 className="text-[20pt] font-black uppercase leading-none">Understanding Insulin Resistance</h4>
                        <p className="text-[11pt] font-bold opacity-60 uppercase">The foundation of metabolic health</p>
                    </div>
                    <button className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">
                        START LEARNING
                    </button>
                </div>

                {/* Library Grid */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-[12pt] font-black uppercase text-gray-400 tracking-widest px-1">Library</h4>
                    {COURSES.map((course) => (
                        <div key={course.title} className="app-section flex items-center justify-between !p-5 !border-gray-100 hover:scale-[1.01] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl" style={{ color: course.color }}>
                                    <course.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10pt] font-black uppercase tracking-tighter" style={{ color: course.color }}>{course.category}</p>
                                    <p className="text-[13pt] font-black uppercase leading-tight">{course.title}</p>
                                    <p className="text-[9pt] font-bold opacity-40 uppercase tracking-tight">{course.duration}</p>
                                </div>
                            </div>
                            <ChevronRight className="opacity-20" size={24} />
                        </div>
                    ))}
                </div>

            </div>
        </ProtectedRoute>
    );
}
