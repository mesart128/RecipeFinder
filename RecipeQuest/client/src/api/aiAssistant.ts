import api from './api';
import { Recipe } from './recipes';

export interface AIRecommendation {
  _id: string;
  recipes: Recipe[];
  reasoning: string;
  nutritionalInfo: {
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  mealPlan?: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  };
}

export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Description: Get AI recipe recommendations based on user profile
// Endpoint: POST /api/ai/recommendations
// Request: { preferences?: string, mealType?: string, occasion?: string }
// Response: { recommendation: AIRecommendation }
export const getAIRecommendations = (data: { preferences?: string; mealType?: string; occasion?: string }) => {
  console.log("Getting AI recommendations with data:", data);

  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recommendation: {
          _id: 'rec1',
          recipes: [
            {
              _id: '1',
              name: 'Mediterranean Quinoa Bowl',
              description: 'A healthy, protein-rich bowl perfect for your dietary preferences and calorie goals',
              image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format',
              cookingTime: 25,
              difficulty: 'Easy',
              cuisine: 'Mediterranean',
              servings: 2,
              prepTime: 15,
              ingredients: [
                { _id: 'i1', name: 'Quinoa', quantity: '1', unit: 'cup' },
                { _id: 'i2', name: 'Cherry tomatoes', quantity: '200', unit: 'g' },
                { _id: 'i3', name: 'Cucumber', quantity: '1', unit: 'medium' },
                { _id: 'i4', name: 'Feta cheese', quantity: '100', unit: 'g' },
                { _id: 'i5', name: 'Olive oil', quantity: '2', unit: 'tbsp' }
              ],
              instructions: [
                'Cook quinoa according to package directions',
                'Chop vegetables into bite-sized pieces',
                'Combine all ingredients in a bowl',
                'Drizzle with olive oil and season',
                'Serve immediately or chill for later'
              ],
              tags: ['healthy', 'vegetarian', 'mediterranean']
            }
          ],
          reasoning: 'Based on your vegetarian preferences and Mediterranean cuisine love, this quinoa bowl provides balanced nutrition while avoiding your allergens. It fits your 2000-calorie goal and intermediate cooking level.',
          nutritionalInfo: {
            totalCalories: 450,
            protein: 18,
            carbs: 52,
            fat: 16
          }
        }
      });
    }, 1000);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/ai/recommendations', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Chat with AI assistant
// Endpoint: POST /api/ai/chat
// Request: { message: string, conversationId?: string }
// Response: { response: ChatMessage, conversationId: string }
export const chatWithAI = (data: { message: string; conversationId?: string }) => {
  console.log("Chatting with AI:", data.message);

  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        "Based on your profile, I'd recommend trying some Mediterranean dishes that are rich in healthy fats and proteins. Would you like me to suggest some specific recipes?",
        "I notice you prefer medium spice levels. How about a delicious Thai curry that's not too spicy but full of flavor?",
        "Since you're working on weight loss goals, I can suggest some low-calorie, high-protein meals that will keep you satisfied.",
        "Given your nut allergy, I'll make sure to avoid any recipes with nuts or suggest safe alternatives.",
        "For your intermediate cooking level, I have some exciting recipes that will challenge you without being overwhelming."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      resolve({
        response: {
          _id: `msg_${Date.now()}`,
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date().toISOString()
        },
        conversationId: data.conversationId || `conv_${Date.now()}`
      });
    }, 800);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/ai/chat', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Generate meal plan
// Endpoint: POST /api/ai/meal-plan
// Request: { days: number, preferences?: string }
// Response: { mealPlan: { [day: string]: AIRecommendation } }
export const generateMealPlan = (data: { days: number; preferences?: string }) => {
  console.log("Generating meal plan for", data.days, "days");

  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const mealPlan: { [key: string]: AIRecommendation } = {};
      
      for (let i = 1; i <= data.days; i++) {
        mealPlan[`day${i}`] = {
          _id: `plan_day${i}`,
          recipes: [],
          reasoning: `Day ${i} focuses on balanced nutrition with your preferred cuisines`,
          nutritionalInfo: {
            totalCalories: 1800,
            protein: 120,
            carbs: 200,
            fat: 60
          },
          mealPlan: {
            breakfast: {
              _id: `b${i}`,
              name: 'Mediterranean Breakfast Bowl',
              description: 'Healthy start to your day',
              image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop&auto=format',
              cookingTime: 15,
              difficulty: 'Easy',
              cuisine: 'Mediterranean',
              servings: 1,
              prepTime: 10,
              ingredients: [],
              instructions: [],
              tags: ['breakfast', 'healthy']
            },
            lunch: {
              _id: `l${i}`,
              name: 'Italian Caprese Salad',
              description: 'Fresh and light lunch option',
              image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&h=300&fit=crop&auto=format',
              cookingTime: 10,
              difficulty: 'Easy',
              cuisine: 'Italian',
              servings: 1,
              prepTime: 10,
              ingredients: [],
              instructions: [],
              tags: ['lunch', 'vegetarian']
            },
            dinner: {
              _id: `d${i}`,
              name: 'Mediterranean Grilled Vegetables',
              description: 'Satisfying dinner with your favorite flavors',
              image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format',
              cookingTime: 30,
              difficulty: 'Medium',
              cuisine: 'Mediterranean',
              servings: 1,
              prepTime: 15,
              ingredients: [],
              instructions: [],
              tags: ['dinner', 'healthy']
            }
          }
        };
      }

      resolve({ mealPlan });
    }, 1200);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/ai/meal-plan', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};