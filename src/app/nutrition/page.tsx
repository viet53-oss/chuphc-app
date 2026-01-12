'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Apple, Plus, X } from 'lucide-react';

export default function NutritionPage() {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        meal_type: 'breakfast',
        meal_name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase.from('nutrition_logs').insert([
                {
                    user_id: user.id,
                    meal_type: formData.meal_type,
                    meal_name: formData.meal_name,
                    calories: formData.calories ? parseInt(formData.calories) : null,
                    protein: formData.protein ? parseFloat(formData.protein) : null,
                    carbs: formData.carbs ? parseFloat(formData.carbs) : null,
                    fats: formData.fats ? parseFloat(formData.fats) : null,
                    notes: formData.notes,
                },
            ]);

            if (error) throw error;

            // Reset form
            setFormData({
                meal_type: 'breakfast',
                meal_name: '',
                calories: '',
                protein: '',
                carbs: '',
                fats: '',
                notes: '',
            });
            setShowForm(false);
            alert('Meal logged successfully!');
        } catch (error: any) {
            alert('Error logging meal: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-3 w-full animate-fade-in pb-20">
                {/* Header */}
                <div className="app-section flex items-center justify-between !border-[#10b981] bg-[#10b981]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#10b981] rounded-lg flex items-center justify-center">
                            <Apple size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="title-md">Nutrition</h2>
                            <p className="text-small opacity-60">Track your meals</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="p-2 bg-[#10b981] text-white rounded-full hover:bg-[#10b981]/90 active:scale-95 transition-all"
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                    </button>
                </div>

                {/* Log Form */}
                {showForm && (
                    <div className="app-section !p-6">
                        <h3 className="title-md mb-4">Log a Meal</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-body font-bold mb-2">Meal Type</label>
                                <select
                                    value={formData.meal_type}
                                    onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">Meal Name</label>
                                <input
                                    type="text"
                                    value={formData.meal_name}
                                    onChange={(e) => setFormData({ ...formData, meal_name: e.target.value })}
                                    placeholder="e.g., Grilled Chicken Salad"
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-body font-bold mb-2">Calories</label>
                                    <input
                                        type="number"
                                        value={formData.calories}
                                        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                        placeholder="350"
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body font-bold mb-2">Protein (g)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.protein}
                                        onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                                        placeholder="25"
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-body font-bold mb-2">Carbs (g)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.carbs}
                                        onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                                        placeholder="30"
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body font-bold mb-2">Fats (g)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.fats}
                                        onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                                        placeholder="15"
                                        className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-body font-bold mb-2">Notes (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Any additional notes..."
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#10b981] text-white py-3 rounded-lg font-bold text-body hover:bg-[#10b981]/90 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Logging...' : 'Log Meal'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Info Card */}
                <div className="app-section !p-6 bg-[#10b981]/5">
                    <h3 className="title-md mb-2">Track Your Nutrition</h3>
                    <p className="text-body opacity-60 mb-4">
                        Log your meals to monitor your calorie intake and macronutrient balance. Consistent tracking helps you make informed decisions about your diet.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border-2 border-black">
                            <p className="text-small opacity-60">Today's Calories</p>
                            <p className="title-md text-[#10b981]">0</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border-2 border-black">
                            <p className="text-small opacity-60">Meals Logged</p>
                            <p className="title-md text-[#10b981]">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
