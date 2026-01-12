// Database types for Chu Precision Health Center

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    date_of_birth?: string;
    phone?: string;
    avatar_url?: string;
    precision_score: number;
    tier: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite Professional';
    achievement_points: number;
    created_at: string;
    updated_at: string;
}

export interface NutritionLog {
    id: string;
    user_id: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    meal_name?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    notes?: string;
    logged_at: string;
    created_at: string;
}

export interface ActivityLog {
    id: string;
    user_id: string;
    activity_type: string;
    duration_minutes: number;
    intensity?: 'low' | 'moderate' | 'high';
    calories_burned?: number;
    distance?: number;
    notes?: string;
    logged_at: string;
    created_at: string;
}

export interface StressLog {
    id: string;
    user_id: string;
    stress_level: number; // 1-10
    activity?: string;
    duration_minutes?: number;
    notes?: string;
    logged_at: string;
    created_at: string;
}

export interface SleepLog {
    id: string;
    user_id: string;
    sleep_start: string;
    sleep_end: string;
    duration_hours?: number;
    quality?: number; // 1-10
    notes?: string;
    created_at: string;
}

export interface SocialLog {
    id: string;
    user_id: string;
    activity_type: string;
    duration_minutes?: number;
    satisfaction_level?: number; // 1-10
    notes?: string;
    logged_at: string;
    created_at: string;
}

export interface SubstanceLog {
    id: string;
    user_id: string;
    substance_type: string;
    quantity?: string;
    unit?: string;
    notes?: string;
    logged_at: string;
    created_at: string;
}

export interface EducationContent {
    id: string;
    title: string;
    category: 'nutrition' | 'activity' | 'stress' | 'sleep' | 'social' | 'risky';
    content: string;
    summary?: string;
    image_url?: string;
    video_url?: string;
    read_time_minutes?: number;
    published: boolean;
    created_at: string;
    updated_at: string;
}

export interface EducationProgress {
    id: string;
    user_id: string;
    content_id: string;
    completed: boolean;
    completed_at?: string;
    created_at: string;
}

export interface Achievement {
    id: string;
    name: string;
    description?: string;
    category?: string;
    points: number;
    icon?: string;
    requirement_type?: 'streak' | 'count' | 'milestone';
    requirement_value?: number;
    created_at: string;
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    earned_at: string;
}

export interface Goal {
    id: string;
    user_id: string;
    category: 'nutrition' | 'activity' | 'stress' | 'sleep' | 'social' | 'risky';
    title: string;
    description?: string;
    target_value?: number;
    current_value: number;
    unit?: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
    start_date: string;
    end_date?: string;
    completed: boolean;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}
