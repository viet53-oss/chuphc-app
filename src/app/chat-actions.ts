'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getGeminiResponse(message: string, contextData: any) {
    if (!process.env.GEMINI_API_KEY) {
        return "I'm sorry, I process health data securely but my AI connection is currently unconfigured. Please check the system settings.";
    }

    // Parse logs for better AI readability
    const recentLogs = (contextData.nutrition?.allLogs || []).slice(0, 100).map((log: any) => {
        let items = [];
        try {
            if (log.notes) {
                const parsed = JSON.parse(log.notes);
                items = parsed.items || [];
            }
        } catch (e) {
            items = [log.notes];
        }
        return {
            time: log.logged_at,
            type: log.meal_type,
            calories: log.calories,
            items: items
        };
    });

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        // Construct a helpful system prompt with context
        const systemPrompt = `
You are the "Chu Precision Health Assistant", a friendly, empathetic, and knowledgeable wellness companion.
You are talking to a user about their health data.

CURRENT USER CONTEXT:
Profile: ${JSON.stringify(contextData.profile || {})}
Recent Nutrition History (Last 50): ${JSON.stringify(recentLogs)}
Today's Stats: ${contextData.nutrition?.totalCaloriesToday} calories, ${contextData.nutrition?.mealsLoggedToday} meals.
Goals: ${JSON.stringify(contextData.goals || [])}

INSTRUCTIONS:
1. Answer the user's question directly and helpfully.
2. If they ask about their data (e.g. "What did I eat?"), use the CONTEXT provided above.
3. If they ask general health questions (e.g. "Is a banana good?"), answer with general nutritional knowledge.
4. Keep answers concise (under 3-4 sentences) unless a detailed explanation is requested.
5. Be encouraging and positive!

USER MESSAGE: "${message}"
`;

        // Simple retry logic for stability
        let lastError;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const result = await model.generateContent(systemPrompt);
                const response = result.response;
                return response.text();
            } catch (error: any) {
                console.error(`Gemini Attempt ${attempt + 1} failed:`, error);
                lastError = error;
                // If it's a 429 (Too Many Requests), wait longer
                if (error.message?.includes('429') || error.status === 429) {
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s specifically for rate limits
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }
        throw lastError;

    } catch (error: any) {
        console.error('Gemini API Error (Final):', error);

        if (error.message?.includes('429') || error.status === 429) {
            return "I'm receiving too many requests right now. Please wait a minute and try again.";
        }

        return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
    }
}
