export const HEALTH_KNOWLEDGE = {
    // DIET & NUTRITION
    diet: {
        principles: [
            "Fiber First: Eat greens or fiber before carbohydrates to blunt glucose spikes.",
            "Protein Anchoring: Consume at least 25-30g of protein in every major meal.",
            "Low Glycemic Only: Avoid refined flours and white sugars; prefer legumes, quinoa, and oats.",
            "6 PM Cutoff: Limit heavy carbs and sugars after 6 PM for better metabolic health.",
            "Hydration: Aim for 8-10 glasses of water daily; avoid liquid calories.",
            "Whole Foods: Focus on single-ingredient foods to minimize processed additives."
        ],
        faqs: [
            {
                keywords: ["protein", "muscle", "meat", "chicken", "fish", "tofu"],
                answer: "For Chu Precision Health, we recommend 'Protein Anchoring'. Aim for 25-30g of lean protein (like fish, poultry, or legumes) at every meal to support metabolism and satiety."
            },
            {
                keywords: ["sugar", "sweet", "dessert", "candy", "chocolate"],
                answer: "Our protocol suggests a 6 PM cutoff for sugars. Also, always prioritize 'Low Glycemic' alternatives like berries or dark chocolate in very small amounts."
            },
            {
                keywords: ["bread", "rice", "pasta", "carbs", "carbohydrates"],
                answer: "Switch to 'Low Glycemic' carbs. Instead of white bread or rice, try quinoa, lentils, or sweet potatoes. And remember the 'Fiber First' rule—eat your veggies first!"
            },
            {
                keywords: ["drink", "water", "soda", "juice", "coffee"],
                answer: "Hydration is key. Stick to water, herbal tea, or black coffee. Avoid 'liquid calories' like sodas or fruit juices which cause massive insulin spikes."
            }
        ]
    },

    // EXERCISE & ACTIVITY
    exercise: {
        principles: [
            "Move Daily: Aim for at least 30 minutes of moderate activity every day.",
            "Strength Training: Include resistance exercises 2-3 times per week.",
            "HIIT Benefits: High-intensity interval training boosts metabolism.",
            "Recovery Matters: Rest days are essential for muscle repair and growth.",
            "Consistency Over Intensity: Regular moderate exercise beats sporadic intense workouts."
        ],
        faqs: [
            {
                keywords: ["walk", "walking", "steps", "daily", "everyday", "how long", "how much", "minutes"],
                answer: "Aim for at least 30 minutes of brisk walking daily, or 10,000 steps per day. This moderate activity improves cardiovascular health, boosts mood, and helps maintain a healthy weight."
            },
            {
                keywords: ["workout", "exercise", "gym", "fitness", "training", "active", "activity"],
                answer: "Aim for 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus strength training 2-3 times weekly."
            },
            {
                keywords: ["cardio", "running", "jogging", "aerobic"],
                answer: "Cardio is excellent for heart health! Start with brisk walking 30 minutes daily, then progress to jogging or running as your fitness improves."
            },
            {
                keywords: ["weights", "strength", "muscle", "lifting", "resistance"],
                answer: "Strength training builds muscle, boosts metabolism, and strengthens bones. Start with bodyweight exercises, then add weights as you progress."
            }
        ]
    },

    // SLEEP
    sleep: {
        principles: [
            "7-9 Hours: Adults need 7-9 hours of quality sleep per night.",
            "Consistent Schedule: Go to bed and wake up at the same time daily.",
            "Dark & Cool: Keep bedroom dark, quiet, and cool (60-67°F).",
            "No Screens: Avoid screens 1 hour before bedtime.",
            "Wind Down: Create a relaxing bedtime routine."
        ],
        faqs: [
            {
                keywords: ["sleep", "insomnia", "tired", "rest", "bed"],
                answer: "Aim for 7-9 hours of quality sleep. Maintain a consistent schedule, keep your room cool and dark, and avoid screens before bed."
            },
            {
                keywords: ["nap", "napping", "afternoon"],
                answer: "Short naps (20-30 minutes) can boost alertness. Avoid napping after 3 PM as it may interfere with nighttime sleep."
            }
        ]
    },

    // STRESS MANAGEMENT
    stress: {
        principles: [
            "Mindfulness: Practice 10 minutes of meditation or deep breathing daily.",
            "Time Management: Prioritize tasks and avoid overcommitment.",
            "Social Support: Connect with friends and family regularly.",
            "Physical Activity: Exercise is a powerful stress reliever.",
            "Limit Caffeine: Too much caffeine can increase anxiety."
        ],
        faqs: [
            {
                keywords: ["stress", "anxiety", "worried", "overwhelmed", "pressure"],
                answer: "Try deep breathing exercises: inhale for 4 counts, hold for 4, exhale for 4. Practice daily meditation, exercise regularly, and maintain social connections."
            },
            {
                keywords: ["meditation", "mindfulness", "relax", "calm"],
                answer: "Start with just 5-10 minutes daily. Sit comfortably, focus on your breath, and gently return attention when your mind wanders. Apps like Headspace can help."
            }
        ]
    },

    // GENERAL HEALTH
    general: {
        faqs: [
            {
                keywords: ["healthy", "health", "wellness", "wellbeing"],
                answer: "Optimal health comes from balancing nutrition, exercise, sleep, and stress management. Focus on whole foods, regular movement, quality sleep, and mindfulness."
            },
            {
                keywords: ["weight", "lose", "fat", "slim"],
                answer: "Sustainable weight loss combines a balanced diet with regular exercise. Aim for 1-2 pounds per week through a modest calorie deficit and increased activity."
            },
            {
                keywords: ["energy", "tired", "fatigue", "exhausted"],
                answer: "Low energy can stem from poor sleep, dehydration, or nutrient deficiencies. Ensure 7-9 hours sleep, drink plenty of water, and eat balanced meals with protein."
            }
        ]
    },

    default: "I'm your Chu Health Assistant! I can help with questions about diet, exercise, sleep, stress management, and general wellness. What would you like to know?"
};

// Helper function to find the best answer
export function getHealthAnswer(question: string): string {
    const lowerQuestion = question.toLowerCase();

    // Check all categories
    const categories = [
        HEALTH_KNOWLEDGE.diet,
        HEALTH_KNOWLEDGE.exercise,
        HEALTH_KNOWLEDGE.sleep,
        HEALTH_KNOWLEDGE.stress,
        HEALTH_KNOWLEDGE.general
    ];

    for (const category of categories) {
        if (category.faqs) {
            for (const faq of category.faqs) {
                if (faq.keywords.some(keyword => lowerQuestion.includes(keyword))) {
                    return faq.answer;
                }
            }
        }
    }

    // Check for principle requests
    if (lowerQuestion.includes('principle') || lowerQuestion.includes('rule') || lowerQuestion.includes('guide')) {
        if (lowerQuestion.includes('diet') || lowerQuestion.includes('nutrition') || lowerQuestion.includes('food')) {
            return "Here are our diet principles:\n\n" + HEALTH_KNOWLEDGE.diet.principles.join("\n\n");
        }
        if (lowerQuestion.includes('exercise') || lowerQuestion.includes('workout') || lowerQuestion.includes('fitness')) {
            return "Here are our exercise principles:\n\n" + HEALTH_KNOWLEDGE.exercise.principles.join("\n\n");
        }
        if (lowerQuestion.includes('sleep')) {
            return "Here are our sleep principles:\n\n" + HEALTH_KNOWLEDGE.sleep.principles.join("\n\n");
        }
        if (lowerQuestion.includes('stress')) {
            return "Here are our stress management principles:\n\n" + HEALTH_KNOWLEDGE.stress.principles.join("\n\n");
        }
    }

    return HEALTH_KNOWLEDGE.default;
}
