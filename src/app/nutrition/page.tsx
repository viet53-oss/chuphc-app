'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Apple, Home, Camera, Coffee, Utensils, Cookie, Smile, Frown, Meh, Star, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { colors, spacing, fontSize } from '@/lib/design-system';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Food Items Data
const FOOD_ITEMS = [
    'Whole Grains', 'Refined Carbs', 'Plant Proteins', 'Red Meat', 'Poultry / Fish', 'Eggs',
    'Milk / Cheese / Yogurt', 'Plant Milk', 'Fat', 'Nuts, Seeds',
    'Starchy Veggies (1 to 2 cups)', 'Veggies (1 to 2 cups)', 'Veggies (3 to 4 cups)',
    'Avocado', 'Fruits', 'Creamy Dressings', 'Vegan processed food', 'Sweeteners',
    'Cookie, Ice Cream, Chips', 'Chocolate', 'Tea, Coffee', 'Juice / Sweet Drinks',
    'Smoothies', 'Protein Powder Shake', 'Water', 'Unsweetened Beverage', 'Alcohol',
    'No Oil Cooking', 'Outside Meal'
];

// Breakfast Food Items with Calories
const BREAKFAST_ITEMS = [
    { name: 'Scrambled Eggs (2)', calories: 180 },
    { name: 'Oatmeal (1 cup)', calories: 150 },
    { name: 'Greek Yogurt (1 cup)', calories: 130 },
    { name: 'Whole Wheat Toast (2 slices)', calories: 160 },
    { name: 'Banana', calories: 105 },
    { name: 'Blueberries (1 cup)', calories: 85 },
    { name: 'Avocado Toast', calories: 250 },
    { name: 'Pancakes (3)', calories: 350 },
    { name: 'Waffles (2)', calories: 400 },
    { name: 'Bacon (3 strips)', calories: 130 },
    { name: 'Sausage (2 links)', calories: 200 },
    { name: 'Bagel with Cream Cheese', calories: 350 },
    { name: 'Cereal with Milk (1 cup)', calories: 200 },
    { name: 'Smoothie Bowl', calories: 300 },
    { name: 'French Toast (2 slices)', calories: 320 },
    { name: 'Breakfast Burrito', calories: 450 },
    { name: 'Granola (1/2 cup)', calories: 210 },
    { name: 'Protein Shake', calories: 180 },
    { name: 'Coffee with Cream', calories: 50 },
    { name: 'Orange Juice (1 cup)', calories: 110 }
];

// Lunch Food Items with Calories
const LUNCH_ITEMS = [
    { name: 'Grilled Chicken Salad', calories: 350 },
    { name: 'Turkey Sandwich', calories: 320 },
    { name: 'Caesar Salad', calories: 280 },
    { name: 'Chicken Wrap', calories: 400 },
    { name: 'Soup and Salad', calories: 250 },
    { name: 'Veggie Burger', calories: 310 },
    { name: 'Tuna Salad', calories: 290 },
    { name: 'Quinoa Bowl', calories: 380 },
    { name: 'Pasta Salad', calories: 350 },
    { name: 'Chicken Noodle Soup', calories: 200 },
    { name: 'BLT Sandwich', calories: 380 },
    { name: 'Burrito Bowl', calories: 450 },
    { name: 'Sushi Roll (8 pieces)', calories: 300 },
    { name: 'Pizza (2 slices)', calories: 500 },
    { name: 'Stir Fry with Rice', calories: 420 },
    { name: 'Fish Tacos (2)', calories: 380 },
    { name: 'Greek Salad', calories: 260 },
    { name: 'Chicken Quesadilla', calories: 480 },
    { name: 'Veggie Wrap', calories: 280 },
    { name: 'Poke Bowl', calories: 400 }
];

// Dinner Food Items with Calories
const DINNER_ITEMS = [
    { name: 'Grilled Salmon (6 oz)', calories: 350 },
    { name: 'Steak (8 oz)', calories: 550 },
    { name: 'Chicken Breast (6 oz)', calories: 280 },
    { name: 'Pasta with Marinara', calories: 400 },
    { name: 'Roasted Vegetables', calories: 150 },
    { name: 'Baked Potato', calories: 160 },
    { name: 'Brown Rice (1 cup)', calories: 215 },
    { name: 'Mashed Potatoes', calories: 210 },
    { name: 'Grilled Shrimp (6 oz)', calories: 200 },
    { name: 'Beef Stir Fry', calories: 480 },
    { name: 'Chicken Parmesan', calories: 520 },
    { name: 'Lasagna', calories: 450 },
    { name: 'Pork Chop (6 oz)', calories: 320 },
    { name: 'Vegetable Curry', calories: 350 },
    { name: 'Spaghetti Bolognese', calories: 480 },
    { name: 'Grilled Chicken Thighs', calories: 380 },
    { name: 'Baked Cod (6 oz)', calories: 220 },
    { name: 'Beef Tacos (3)', calories: 520 },
    { name: 'Stuffed Bell Peppers', calories: 300 },
    { name: 'Shepherd\'s Pie', calories: 450 }
];

// Snack Food Items with Calories
const SNACK_ITEMS = [
    { name: 'Apple with Peanut Butter', calories: 200 },
    { name: 'Mixed Nuts (1/4 cup)', calories: 180 },
    { name: 'Protein Bar', calories: 200 },
    { name: 'Greek Yogurt', calories: 130 },
    { name: 'Hummus with Veggies', calories: 150 },
    { name: 'String Cheese', calories: 80 },
    { name: 'Trail Mix (1/4 cup)', calories: 170 },
    { name: 'Granola Bar', calories: 140 },
    { name: 'Crackers with Cheese', calories: 200 },
    { name: 'Baby Carrots', calories: 35 },
    { name: 'Popcorn (3 cups)', calories: 90 },
    { name: 'Dark Chocolate (1 oz)', calories: 170 },
    { name: 'Rice Cakes (2)', calories: 70 },
    { name: 'Almonds (1 oz)', calories: 160 },
    { name: 'Cottage Cheese (1/2 cup)', calories: 110 },
    { name: 'Fruit Smoothie', calories: 180 },
    { name: 'Pretzels (1 oz)', calories: 110 },
    { name: 'Celery with Almond Butter', calories: 150 },
    { name: 'Hard Boiled Egg', calories: 70 },
    { name: 'Banana', calories: 105 }
];

export default function NutritionPage() {
    const { user } = useAuth();
    const [dailyCalories, setDailyCalories] = useState(0);
    const [mealsLogged, setMealsLogged] = useState(0);
    const [showLogMealPopup, setShowLogMealPopup] = useState(false);
    const [showBreakfastPopup, setShowBreakfastPopup] = useState(false);
    const [selectedBreakfastItems, setSelectedBreakfastItems] = useState<string[]>([]);
    const [breakfastMood, setBreakfastMood] = useState('');
    const [showLunchPopup, setShowLunchPopup] = useState(false);
    const [selectedLunchItems, setSelectedLunchItems] = useState<string[]>([]);
    const [lunchMood, setLunchMood] = useState('');
    const [showDinnerPopup, setShowDinnerPopup] = useState(false);
    const [selectedDinnerItems, setSelectedDinnerItems] = useState<string[]>([]);
    const [dinnerMood, setDinnerMood] = useState('');
    const [showSnackPopup, setShowSnackPopup] = useState(false);
    const [selectedSnackItems, setSelectedSnackItems] = useState<string[]>([]);
    const [snackMood, setSnackMood] = useState('');
    const [breakfastSortMode, setBreakfastSortMode] = useState<'like' | 'abc' | 'calories'>('like');
    const [breakfastItemFrequency, setBreakfastItemFrequency] = useState<Record<string, number>>({});
    const [mealLog, setMealLog] = useState<Array<{
        time: string;
        type: string;
        items: string[];
        mood: string;
        calories: number;
    }>>([]);

    // Load meal log from Supabase on mount
    useEffect(() => {
        if (!user) return;

        const loadMeals = async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data, error } = await supabase
                .from('nutrition_logs')
                .select('*')
                .eq('user_id', user.id)
                .gte('logged_at', today.toISOString())
                .order('logged_at', { ascending: false });

            if (data && !error) {
                const meals = data.map(log => {
                    const loggedTime = new Date(log.logged_at);
                    const notes = log.notes ? JSON.parse(log.notes) : {};

                    return {
                        time: loggedTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                        type: log.meal_type,
                        items: notes.items || [],
                        mood: notes.mood || '',
                        calories: log.calories || 0
                    };
                });

                setMealLog(meals);

                // Calculate totals
                const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
                setDailyCalories(totalCalories);
                setMealsLogged(meals.length);
            }
        };

        loadMeals();

        // Load breakfast frequency from localStorage
        const savedFrequency = localStorage.getItem('breakfast_frequency');
        if (savedFrequency) {
            setBreakfastItemFrequency(JSON.parse(savedFrequency));
        }
    }, [user]);

    // Log Meal Form States
    const [mealType, setMealType] = useState('Lunch');
    const [mood, setMood] = useState('');
    const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
    const [rating, setRating] = useState(0);
    const [speed, setSpeed] = useState('');
    const [comment, setComment] = useState('');

    const toggleFood = (food: string) => {
        if (selectedFoods.includes(food)) {
            setSelectedFoods(selectedFoods.filter(f => f !== food));
        } else {
            setSelectedFoods([...selectedFoods, food]);
        }
    };

    const toggleBreakfastItem = (itemName: string) => {
        if (selectedBreakfastItems.includes(itemName)) {
            setSelectedBreakfastItems(selectedBreakfastItems.filter(i => i !== itemName));
        } else {
            setSelectedBreakfastItems([...selectedBreakfastItems, itemName]);
        }
    };

    const calculateBreakfastCalories = () => {
        return BREAKFAST_ITEMS
            .filter(item => selectedBreakfastItems.includes(item.name))
            .reduce((total, item) => total + item.calories, 0);
    };

    const getSortedBreakfastItems = () => {
        const items = [...BREAKFAST_ITEMS];

        if (breakfastSortMode === 'abc') {
            return items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (breakfastSortMode === 'calories') {
            return items.sort((a, b) => a.calories - b.calories); // Lowest to highest
        } else {
            // 'like' - sort by selection frequency (most selected first)
            return items.sort((a, b) => {
                const freqA = breakfastItemFrequency[a.name] || 0;
                const freqB = breakfastItemFrequency[b.name] || 0;
                return freqB - freqA; // Higher frequency first
            });
        }
    };

    const handleAddBreakfast = async () => {
        if (!user) return;

        const calories = calculateBreakfastCalories();
        const now = new Date();

        // Save to Supabase
        const { error } = await supabase
            .from('nutrition_logs')
            .insert([{
                user_id: user.id,
                meal_type: 'Breakfast',
                calories: calories,
                notes: JSON.stringify({
                    items: selectedBreakfastItems,
                    mood: breakfastMood
                }),
                logged_at: now.toISOString()
            }]);

        if (!error) {
            // Update local state
            const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            setMealLog(prev => [{
                time: timeString,
                type: 'Breakfast',
                items: selectedBreakfastItems,
                mood: breakfastMood,
                calories: calories
            }, ...prev]);

            setDailyCalories(prev => prev + calories);
            setMealsLogged(prev => prev + 1);

            // Update frequency tracking
            const updatedFrequency = { ...breakfastItemFrequency };
            selectedBreakfastItems.forEach(itemName => {
                updatedFrequency[itemName] = (updatedFrequency[itemName] || 0) + 1;
            });
            setBreakfastItemFrequency(updatedFrequency);
            localStorage.setItem('breakfast_frequency', JSON.stringify(updatedFrequency));
        }

        setShowBreakfastPopup(false);
        setSelectedBreakfastItems([]);
        setBreakfastMood('');
    };

    // Lunch handlers
    const toggleLunchItem = (itemName: string) => {
        if (selectedLunchItems.includes(itemName)) {
            setSelectedLunchItems(selectedLunchItems.filter(i => i !== itemName));
        } else {
            setSelectedLunchItems([...selectedLunchItems, itemName]);
        }
    };

    const calculateLunchCalories = () => {
        return LUNCH_ITEMS
            .filter(item => selectedLunchItems.includes(item.name))
            .reduce((total, item) => total + item.calories, 0);
    };

    const handleAddLunch = async () => {
        if (!user) return;
        const calories = calculateLunchCalories();
        const now = new Date();

        const { error } = await supabase
            .from('nutrition_logs')
            .insert([{
                user_id: user.id,
                meal_type: 'Lunch',
                calories: calories,
                notes: JSON.stringify({
                    items: selectedLunchItems,
                    mood: lunchMood
                }),
                logged_at: now.toISOString()
            }]);

        if (!error) {
            const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            setMealLog(prev => [{
                time: timeString,
                type: 'Lunch',
                items: selectedLunchItems,
                mood: lunchMood,
                calories: calories
            }, ...prev]);

            setDailyCalories(prev => prev + calories);
            setMealsLogged(prev => prev + 1);
        }

        setShowLunchPopup(false);
        setSelectedLunchItems([]);
        setLunchMood('');
    };

    // Dinner handlers
    const toggleDinnerItem = (itemName: string) => {
        if (selectedDinnerItems.includes(itemName)) {
            setSelectedDinnerItems(selectedDinnerItems.filter(i => i !== itemName));
        } else {
            setSelectedDinnerItems([...selectedDinnerItems, itemName]);
        }
    };

    const calculateDinnerCalories = () => {
        return DINNER_ITEMS
            .filter(item => selectedDinnerItems.includes(item.name))
            .reduce((total, item) => total + item.calories, 0);
    };

    const handleAddDinner = async () => {
        if (!user) return;
        const calories = calculateDinnerCalories();
        const now = new Date();

        const { error } = await supabase
            .from('nutrition_logs')
            .insert([{
                user_id: user.id,
                meal_type: 'Dinner',
                calories: calories,
                notes: JSON.stringify({
                    items: selectedDinnerItems,
                    mood: dinnerMood
                }),
                logged_at: now.toISOString()
            }]);

        if (!error) {
            const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            setMealLog(prev => [{
                time: timeString,
                type: 'Dinner',
                items: selectedDinnerItems,
                mood: dinnerMood,
                calories: calories
            }, ...prev]);

            setDailyCalories(prev => prev + calories);
            setMealsLogged(prev => prev + 1);
        }

        setShowDinnerPopup(false);
        setSelectedDinnerItems([]);
        setDinnerMood('');
    };

    // Snack handlers
    const toggleSnackItem = (itemName: string) => {
        if (selectedSnackItems.includes(itemName)) {
            setSelectedSnackItems(selectedSnackItems.filter(i => i !== itemName));
        } else {
            setSelectedSnackItems([...selectedSnackItems, itemName]);
        }
    };

    const calculateSnackCalories = () => {
        return SNACK_ITEMS
            .filter(item => selectedSnackItems.includes(item.name))
            .reduce((total, item) => total + item.calories, 0);
    };

    const handleAddSnack = async () => {
        if (!user) return;
        const calories = calculateSnackCalories();
        const now = new Date();

        const { error } = await supabase
            .from('nutrition_logs')
            .insert([{
                user_id: user.id,
                meal_type: 'Snack',
                calories: calories,
                notes: JSON.stringify({
                    items: selectedSnackItems,
                    mood: snackMood
                }),
                logged_at: now.toISOString()
            }]);

        if (!error) {
            const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            setMealLog(prev => [{
                time: timeString,
                type: 'Snack',
                items: selectedSnackItems,
                mood: snackMood,
                calories: calories
            }, ...prev]);

            setDailyCalories(prev => prev + calories);
            setMealsLogged(prev => prev + 1);
        }

        setShowSnackPopup(false);
        setSelectedSnackItems([]);
        setSnackMood('');
    };

    const unselectedFoods = FOOD_ITEMS.filter(f => !selectedFoods.includes(f));

    const handleAddMeal = () => {
        setMealsLogged(prev => prev + 1);
        setShowLogMealPopup(false);
        // Reset form
        setMood('');
        setSelectedFoods([]);
        setRating(0);
        setSpeed('');
        setComment('');
    };

    return (
        <ProtectedRoute>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', padding: '2px' }}>

                {/* Stats Section */}
                <section style={{
                    border: '2px solid black',
                    borderRadius: '12px',
                    backgroundColor: colors.white,
                    padding: '2px',
                    margin: '2px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px' }}>
                        <h2 style={{ fontSize: '16pt', fontWeight: 'bold', margin: 0 }}>Today's Summary</h2>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '10px',
                                backgroundColor: colors.black,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: '14pt',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}>
                                Home
                            </button>
                        </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', margin: '2px' }}>
                        <div style={{
                            padding: '2px',
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '12pt', color: colors.gray, margin: '2px' }}>Calories</p>
                            <p style={{ fontSize: '16pt', fontWeight: 'bold', margin: '2px' }}>{dailyCalories}</p>
                        </div>
                        <div style={{
                            padding: '2px',
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '12pt', color: colors.gray, margin: '2px' }}>Meals</p>
                            <p style={{ fontSize: '16pt', fontWeight: 'bold', margin: '2px' }}>{mealsLogged}/4</p>
                        </div>
                    </div>
                </section>

                {/* Meals */}
                <section style={{
                    border: '2px solid black',
                    borderRadius: '12px',
                    backgroundColor: colors.white,
                    padding: '2px',
                    margin: '2px'
                }}>
                    <h2 style={{ fontSize: '16pt', fontWeight: 'bold', marginBottom: '2px' }}>Meals</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                        <button
                            onClick={() => {
                                setShowBreakfastPopup(true);
                            }}
                            style={{
                                padding: '10px',
                                backgroundColor: '#f97316',
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: '18pt',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Breakfast
                        </button>
                        <button
                            onClick={() => {
                                setShowLunchPopup(true);
                            }}
                            style={{
                                padding: '10px',
                                backgroundColor: '#22c55e',
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: '18pt',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Lunch
                        </button>
                        <button
                            onClick={() => {
                                setShowDinnerPopup(true);
                            }}
                            style={{
                                padding: '10px',
                                backgroundColor: '#3b82f6',
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: '18pt',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Dinner
                        </button>
                        <button
                            onClick={() => {
                                setShowSnackPopup(true);
                            }}
                            style={{
                                padding: '10px',
                                backgroundColor: '#a855f7',
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: '18pt',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Snack
                        </button>
                    </div>
                </section>

                {/* Meals Log */}
                <section style={{
                    border: '2px solid black',
                    borderRadius: '12px',
                    backgroundColor: colors.white,
                    padding: '2px',
                    margin: '2px'
                }}>
                    <h2 style={{ fontSize: '16pt', fontWeight: 'bold', marginBottom: '2px' }}>Meals Log</h2>
                    {mealLog.length === 0 ? (
                        <p style={{ fontSize: '14pt', color: colors.gray, textAlign: 'center', padding: '2px' }}>
                            No meals logged yet today
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {mealLog.map((meal, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: spacing.md,
                                        backgroundColor: colors.primaryTint,
                                        borderRadius: '8px',
                                        border: '2px solid black',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                                            <span style={{ fontSize: '14pt', fontWeight: 'bold', color: colors.secondary }}>
                                                {meal.time}
                                            </span>
                                            <span style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                                                {meal.type === 'Breakfast' ? 'BK' : meal.type}
                                            </span>
                                            {meal.mood && (
                                                <span style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                                                    {meal.mood === 'Happy' && <Smile size={20} color={colors.green} />}
                                                    {meal.mood === 'Neutral' && <Meh size={20} color={colors.orange} />}
                                                    {meal.mood === 'Tired' && <Frown size={20} color={colors.red} />}
                                                </span>
                                            )}
                                            <span style={{ fontSize: '16pt', fontWeight: 'bold', color: colors.secondary, marginLeft: 'auto' }}>
                                                {meal.calories} cal
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '14pt', color: colors.gray, marginTop: spacing.xs }}>
                                            {meal.items.length > 0 ? meal.items.join(', ') : 'No items logged'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Home Button */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2px' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <button style={{
                            padding: '10px',
                            backgroundColor: colors.black,
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '14pt',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: spacing.sm
                        }}>
                            Home
                        </button>
                    </Link>
                </div>

            </div>

            {/* Log Meal Full-Screen Popup */}
            {false && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'white',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <Navbar customTitle="Log Meal" />

                    {/* Scrollable Content */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: spacing.lg,
                        paddingBottom: '120px' // Space for footer
                    }}>
                        {/* Picture(s) */}
                        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', color: '#333' }}>Picture(s)<span style={{ color: 'red' }}>*</span></h3>
                            <div style={{ marginTop: spacing.xs, cursor: 'pointer', display: 'inline-block' }}>
                                <Camera size={40} color={colors.blue} />
                            </div>
                        </div>

                        <hr style={{ border: 0, borderTop: '1px solid #ddd', width: '100%', marginBottom: spacing.xl }} />

                        {/* Meal Type */}
                        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', color: '#333' }}>Meal Type<span style={{ color: 'red' }}>*</span></h3>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.xxl, marginTop: spacing.md, flexWrap: 'wrap' }}>
                                {[
                                    { name: 'Breakfast', icon: Coffee },
                                    { name: 'Lunch', icon: Apple },
                                    { name: 'Dinner', icon: Utensils },
                                    { name: 'Snack', icon: Cookie }
                                ].map(type => (
                                    <div
                                        key={type.name}
                                        onClick={() => setMealType(type.name)}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: mealType === type.name ? 1 : 0.5 }}
                                    >
                                        <type.icon size={32} color={mealType === type.name ? colors.green : '#666'} />
                                        <span style={{ fontSize: fontSize.xs, marginTop: '4px', color: mealType === type.name ? colors.green : '#666' }}>{type.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr style={{ border: 0, borderTop: '1px solid #ddd', width: '100%', marginBottom: spacing.xl }} />

                        {/* Mood */}
                        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', color: '#333' }}>Mood<span style={{ color: 'red' }}>*</span></h3>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.lg, marginTop: spacing.md, flexWrap: 'wrap' }}>
                                {[
                                    { name: 'Happy', icon: Smile },
                                    { name: 'Neutral', icon: Meh },
                                    { name: 'Tired', icon: Frown }
                                ].map(m => (
                                    <div
                                        key={m.name}
                                        onClick={() => setMood(m.name)}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: mood === m.name ? 1 : 0.6 }}
                                    >
                                        <m.icon size={32} color={colors.secondary} fill={mood === m.name ? colors.secondary : 'none'} />
                                        <span style={{ fontSize: fontSize.xs, marginTop: '4px' }}>{m.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr style={{ border: 0, borderTop: '1px solid #ddd', width: '100%', marginBottom: spacing.xl }} />

                        {/* Your meal had */}
                        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', color: '#333' }}>Your meal had<span style={{ color: 'red' }}>*</span></h3>
                            <p style={{ fontSize: fontSize.xs, color: '#666' }}>Click all that apply</p>

                            <div style={{ display: 'flex', marginTop: spacing.md, gap: spacing.md }}>
                                {/* Left Column: Available */}
                                <div style={{ flex: 1, borderRight: '2px solid black', paddingRight: spacing.sm, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <h4 style={{ fontSize: fontSize.sm, fontWeight: 'bold', marginBottom: spacing.sm }}>Available</h4>
                                    {unselectedFoods.map(food => (
                                        <button
                                            key={food}
                                            onClick={() => toggleFood(food)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                width: '100%',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {food}
                                        </button>
                                    ))}
                                </div>

                                {/* Right Column: Selected */}
                                <div style={{ flex: 1, paddingLeft: spacing.sm, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <h4 style={{ fontSize: fontSize.sm, fontWeight: 'bold', marginBottom: spacing.sm }}>Selected</h4>
                                    {selectedFoods.map(food => (
                                        <button
                                            key={food}
                                            onClick={() => toggleFood(food)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: colors.primaryTint,
                                                border: `2px solid ${colors.green}`,
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                width: '100%',
                                                textAlign: 'center',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {food}
                                        </button>
                                    ))}
                                    {selectedFoods.length === 0 && <span style={{ color: '#999', fontSize: '12px', fontStyle: 'italic' }}>Select items from left</span>}
                                </div>
                            </div>
                        </div>

                        <hr style={{ border: 0, borderTop: '1px solid #ddd', width: '100%', marginBottom: spacing.xl }} />

                        {/* Meal Rating */}
                        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', color: '#333' }}>Meal Rating<span style={{ color: 'red' }}>*</span></h3>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.sm }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={32}
                                        onClick={() => setRating(star)}
                                        color={colors.secondary}
                                        fill={rating >= star ? colors.secondary : "none"}
                                        cursor="pointer"
                                    />
                                ))}
                            </div>
                        </div>

                        <hr style={{ border: 0, borderTop: '1px solid #ddd', width: '100%', marginBottom: spacing.xl }} />

                        {/* Meal Eating Speed */}
                        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', color: '#333' }}>Meal Eating Speed<span style={{ color: 'red' }}>*</span></h3>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.xl, marginTop: spacing.md, flexWrap: 'wrap' }}>
                                {['5 minutes', '10 minutes', '20 minutes'].map(s => (
                                    <div key={s} onClick={() => setSpeed(s)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        {speed === s ? <CheckCircle2 size={20} color={colors.green} /> : <Circle size={20} color="#ccc" />}
                                        <span style={{ fontSize: fontSize.sm }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr style={{ border: 0, borderTop: '1px solid #ddd', width: '100%', marginBottom: spacing.xl }} />

                        {/* Comment */}
                        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                            <h3 style={{ fontSize: fontSize.base, fontWeight: 'bold', color: '#333' }}>Comment</h3>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Comments about your meal"
                                style={{
                                    width: '100%',
                                    marginTop: spacing.sm,
                                    padding: spacing.md,
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    minHeight: '80px',
                                    fontSize: fontSize.sm
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer - Fixed at bottom, under chatbot */}
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTop: '2px solid black',
                        padding: spacing.lg,
                        zIndex: 201,
                        display: 'flex',
                        gap: spacing.md,
                        paddingBottom: '24px' // Extra padding to be above chatbot button
                    }}>
                        <button
                            onClick={handleAddMeal}
                            style={{
                                flex: 1,
                                backgroundColor: colors.green,
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: fontSize.base,
                                cursor: 'pointer'
                            }}
                        >
                            Add Meal
                        </button>
                        <button
                            onClick={() => setShowLogMealPopup(false)}
                            style={{
                                flex: 1,
                                backgroundColor: colors.gray,
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: fontSize.base,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <Link href="/" style={{ textDecoration: 'none', flex: 1 }}>
                            <button style={{
                                width: '100%',
                                backgroundColor: colors.black,
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: fontSize.base,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: spacing.xs
                            }}>
                                <Home size={20} />
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Breakfast Full-Screen Popup */}
            {showBreakfastPopup && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'white',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <Navbar customTitle="Breakfast" />

                    {/* Scrollable Content */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: spacing.lg,
                        paddingBottom: '140px' // Space for footer
                    }}>
                        <h3 style={{
                            fontSize: fontSize.lg,
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: spacing.md,
                            textAlign: 'center'
                        }}>
                            Select Breakfast Items
                        </h3>

                        {/* Sort Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: spacing.sm,
                            marginBottom: spacing.lg,
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={() => setBreakfastSortMode('like')}
                                style={{
                                    padding: '10px',
                                    backgroundColor: breakfastSortMode === 'like' ? colors.secondary : colors.black,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontSize: '14pt',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    minWidth: '80px'
                                }}
                            >
                                Like
                            </button>
                            <button
                                onClick={() => setBreakfastSortMode('abc')}
                                style={{
                                    padding: '10px',
                                    backgroundColor: breakfastSortMode === 'abc' ? colors.secondary : colors.black,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontSize: '14pt',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    minWidth: '80px'
                                }}
                            >
                                ABC
                            </button>
                            <button
                                onClick={() => setBreakfastSortMode('calories')}
                                style={{
                                    padding: '10px',
                                    backgroundColor: breakfastSortMode === 'calories' ? colors.secondary : colors.black,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontSize: '14pt',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    minWidth: '100px'
                                }}
                            >
                                Calories
                            </button>
                        </div>

                        {/* Breakfast Items List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            {getSortedBreakfastItems().map((item) => {
                                const isSelected = selectedBreakfastItems.includes(item.name);
                                return (
                                    <div
                                        key={item.name}
                                        onClick={() => toggleBreakfastItem(item.name)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: spacing.md,
                                            backgroundColor: isSelected ? colors.primaryTint : 'white',
                                            border: `2px solid ${isSelected ? colors.secondary : '#ddd'}`,
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                                            {isSelected ? (
                                                <CheckCircle2 size={24} color={colors.green} />
                                            ) : (
                                                <Circle size={24} color="#ccc" />
                                            )}
                                            <span style={{
                                                fontSize: fontSize.base,
                                                fontWeight: isSelected ? 'bold' : 'normal'
                                            }}>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span style={{
                                            fontSize: fontSize.base,
                                            fontWeight: 'bold',
                                            color: colors.secondary
                                        }}>
                                            {item.calories} cal
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTop: '2px solid black',
                        padding: spacing.lg,
                        zIndex: 201,
                        paddingBottom: '24px'
                    }}>
                        {/* Mood and Total Calories - Same Line */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.md,
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            border: '2px solid black'
                        }}>
                            {/* Mood Selection */}
                            <div style={{
                                display: 'flex',
                                gap: spacing.md
                            }}>
                                {[
                                    { name: 'Tired', icon: Frown },
                                    { name: 'Neutral', icon: Meh },
                                    { name: 'Happy', icon: Smile }
                                ].map(m => (
                                    <div
                                        key={m.name}
                                        onClick={() => setBreakfastMood(m.name)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            opacity: breakfastMood === m.name ? 1 : 0.6,
                                            transition: 'opacity 0.2s'
                                        }}
                                    >
                                        {breakfastMood === m.name ? (
                                            <CheckCircle2 size={24} color={colors.green} />
                                        ) : (
                                            <Circle size={24} color="#ccc" />
                                        )}
                                        <span style={{
                                            fontSize: fontSize.xs,
                                            marginTop: '2px',
                                            fontWeight: breakfastMood === m.name ? 'bold' : 'normal'
                                        }}>
                                            {m.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Total Calories */}
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: fontSize.xs, color: colors.gray, margin: 0 }}>Total Calories</p>
                                <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', margin: 0, color: colors.secondary }}>
                                    {calculateBreakfastCalories()}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: spacing.md
                        }}>
                            <button
                                onClick={handleAddBreakfast}
                                style={{
                                    flex: 1,
                                    backgroundColor: (selectedBreakfastItems.length > 0 || breakfastMood) ? colors.blue : colors.black,
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    fontSize: '14pt',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowBreakfastPopup(false);
                                    setSelectedBreakfastItems([]);
                                    setBreakfastMood('');
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.black,
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    fontSize: '14pt',
                                    cursor: 'pointer'
                                }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lunch Full-Screen Popup */}
            {showLunchPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'white',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Navbar customTitle="Lunch" />
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: spacing.lg,
                        paddingBottom: '180px'
                    }}>
                        {LUNCH_ITEMS.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => toggleLunchItem(item.name)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: spacing.md,
                                    marginBottom: spacing.sm,
                                    backgroundColor: selectedLunchItems.includes(item.name) ? colors.primaryTint : colors.white,
                                    border: `2px solid ${selectedLunchItems.includes(item.name) ? colors.secondary : '#ddd'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                    {selectedLunchItems.includes(item.name) ?
                                        <CheckCircle2 size={24} color={colors.secondary} /> :
                                        <Circle size={24} color="#ccc" />
                                    }
                                    <span style={{ fontSize: '14pt', fontWeight: selectedLunchItems.includes(item.name) ? 'bold' : 'normal' }}>
                                        {item.name}
                                    </span>
                                </div>
                                <span style={{ fontSize: '12pt', color: colors.gray }}>
                                    {item.calories} cal
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTop: '2px solid black',
                        padding: spacing.lg,
                        zIndex: 201,
                        paddingBottom: '24px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.md,
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            border: '2px solid black'
                        }}>
                            <div style={{ display: 'flex', gap: spacing.md }}>
                                {['Tired', 'Neutral', 'Happy'].map((m) => (
                                    <div
                                        key={m}
                                        onClick={() => setLunchMood(m)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            opacity: lunchMood === m ? 1 : 0.5
                                        }}
                                    >
                                        {m === 'Tired' && <Frown size={24} color={colors.secondary} />}
                                        {m === 'Neutral' && <Meh size={24} color={colors.secondary} />}
                                        {m === 'Happy' && <Smile size={24} color={colors.secondary} />}
                                        <span style={{ fontSize: '12pt', marginTop: spacing.xs }}>{m}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '12pt', color: colors.gray, margin: 0 }}>Total Calories</p>
                                <p style={{ fontSize: '16pt', fontWeight: 'bold', margin: 0, color: colors.secondary }}>
                                    {calculateLunchCalories()}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: spacing.md }}>
                            <button
                                onClick={handleAddLunch}
                                style={{
                                    flex: 1,
                                    backgroundColor: (selectedLunchItems.length > 0 || lunchMood) ? colors.blue : colors.black,
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    fontSize: '14pt',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowLunchPopup(false);
                                    setSelectedLunchItems([]);
                                    setLunchMood('');
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.black,
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    fontSize: '14pt',
                                    cursor: 'pointer'
                                }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dinner Full-Screen Popup */}
            {showDinnerPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'white',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Navbar customTitle="Dinner" />
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: spacing.lg,
                        paddingBottom: '180px'
                    }}>
                        {DINNER_ITEMS.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => toggleDinnerItem(item.name)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: spacing.md,
                                    marginBottom: spacing.sm,
                                    backgroundColor: selectedDinnerItems.includes(item.name) ? colors.primaryTint : colors.white,
                                    border: `2px solid ${selectedDinnerItems.includes(item.name) ? colors.secondary : '#ddd'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                    {selectedDinnerItems.includes(item.name) ?
                                        <CheckCircle2 size={24} color={colors.secondary} /> :
                                        <Circle size={24} color="#ccc" />
                                    }
                                    <span style={{ fontSize: '14pt', fontWeight: selectedDinnerItems.includes(item.name) ? 'bold' : 'normal' }}>
                                        {item.name}
                                    </span>
                                </div>
                                <span style={{ fontSize: '12pt', color: colors.gray }}>
                                    {item.calories} cal
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTop: '2px solid black',
                        padding: spacing.lg,
                        zIndex: 201,
                        paddingBottom: '24px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.md,
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            border: '2px solid black'
                        }}>
                            <div style={{ display: 'flex', gap: spacing.md }}>
                                {['Tired', 'Neutral', 'Happy'].map((m) => (
                                    <div
                                        key={m}
                                        onClick={() => setDinnerMood(m)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            opacity: dinnerMood === m ? 1 : 0.5
                                        }}
                                    >
                                        {m === 'Tired' && <Frown size={24} color={colors.secondary} />}
                                        {m === 'Neutral' && <Meh size={24} color={colors.secondary} />}
                                        {m === 'Happy' && <Smile size={24} color={colors.secondary} />}
                                        <span style={{ fontSize: '12pt', marginTop: spacing.xs }}>{m}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '12pt', color: colors.gray, margin: 0 }}>Total Calories</p>
                                <p style={{ fontSize: '16pt', fontWeight: 'bold', margin: 0, color: colors.secondary }}>
                                    {calculateDinnerCalories()}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: spacing.md }}>
                            <button
                                onClick={handleAddDinner}
                                style={{
                                    flex: 1,
                                    backgroundColor: (selectedDinnerItems.length > 0 || dinnerMood) ? colors.blue : colors.black,
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    fontSize: '14pt',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowDinnerPopup(false);
                                    setSelectedDinnerItems([]);
                                    setDinnerMood('');
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.black,
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    fontSize: '14pt',
                                    cursor: 'pointer'
                                }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Snack Full-Screen Popup */}
            {showSnackPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'white',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Navbar customTitle="Snack" />
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: spacing.lg,
                        paddingBottom: '180px'
                    }}>
                        {SNACK_ITEMS.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => toggleSnackItem(item.name)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: spacing.md,
                                    marginBottom: spacing.sm,
                                    backgroundColor: selectedSnackItems.includes(item.name) ? colors.primaryTint : colors.white,
                                    border: `2px solid ${selectedSnackItems.includes(item.name) ? colors.secondary : '#ddd'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                    {selectedSnackItems.includes(item.name) ?
                                        <CheckCircle2 size={24} color={colors.secondary} /> :
                                        <Circle size={24} color="#ccc" />
                                    }
                                    <span style={{ fontSize: '14pt', fontWeight: selectedSnackItems.includes(item.name) ? 'bold' : 'normal' }}>
                                        {item.name}
                                    </span>
                                </div>
                                <span style={{ fontSize: '12pt', color: colors.gray }}>
                                    {item.calories} cal
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTop: '2px solid black',
                        padding: spacing.lg,
                        zIndex: 201,
                        paddingBottom: '24px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.md,
                            padding: spacing.md,
                            backgroundColor: colors.primaryTint,
                            borderRadius: '8px',
                            border: '2px solid black'
                        }}>
                            <div style={{ display: 'flex', gap: spacing.md }}>
                                {['Tired', 'Neutral', 'Happy'].map((m) => (
                                    <div
                                        key={m}
                                        onClick={() => setSnackMood(m)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            opacity: snackMood === m ? 1 : 0.5
                                        }}
                                    >
                                        {m === 'Tired' && <Frown size={24} color={colors.secondary} />}
                                        {m === 'Neutral' && <Meh size={24} color={colors.secondary} />}
                                        {m === 'Happy' && <Smile size={24} color={colors.secondary} />}
                                        <span style={{ fontSize: '12pt', marginTop: spacing.xs }}>{m}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '12pt', color: colors.gray, margin: 0 }}>Total Calories</p>
                                <p style={{ fontSize: '16pt', fontWeight: 'bold', margin: 0, color: colors.secondary }}>
                                    {calculateSnackCalories()}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: spacing.md }}>
                            <button
                                onClick={handleAddSnack}
                                style={{
                                    flex: 1,
                                    backgroundColor: (selectedSnackItems.length > 0 || snackMood) ? colors.blue : colors.black,
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    fontSize: '14pt',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowSnackPopup(false);
                                    setSelectedSnackItems([]);
                                    setSnackMood('');
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.black,
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    fontSize: '14pt',
                                    cursor: 'pointer'
                                }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
