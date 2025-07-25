import api from './api';

export interface UserProfile {
  _id: string;
  userId: string;
  dietaryRestrictions: string[];
  allergies: string[];
  cuisinePreferences: string[];
  calorieGoal: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  healthGoals: string[];
  dislikedIngredients: string[];
  cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  mealTypes: string[];
  spicePreference: 'mild' | 'medium' | 'spicy';
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  _id: string;
  userId: string;
  plan: 'free' | 'premium';
  status: 'active' | 'inactive' | 'cancelled';
  expiresAt: string;
}

// Description: Get user profile
// Endpoint: GET /api/user/profile
// Request: {}
// Response: { profile: UserProfile }
export const getUserProfile = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        profile: {
          _id: 'profile1',
          userId: 'user1',
          dietaryRestrictions: ['vegetarian'],
          allergies: ['nuts'],
          cuisinePreferences: ['Italian', 'Mediterranean'],
          calorieGoal: 2000,
          activityLevel: 'moderately_active',
          healthGoals: ['weight_loss', 'muscle_gain'],
          dislikedIngredients: ['mushrooms'],
          cookingSkillLevel: 'intermediate',
          mealTypes: ['breakfast', 'lunch', 'dinner'],
          spicePreference: 'medium',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/user/profile');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Create or update user profile
// Endpoint: POST /api/user/profile
// Request: { profile: Partial<UserProfile> }
// Response: { profile: UserProfile, message: string }
export const saveUserProfile = (profileData: Partial<UserProfile>) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        profile: {
          _id: 'profile1',
          userId: 'user1',
          ...profileData,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        message: 'Profile saved successfully'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/user/profile', { profile: profileData });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get user subscription status
// Endpoint: GET /api/user/subscription
// Request: {}
// Response: { subscription: UserSubscription }
export const getUserSubscription = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        subscription: {
          _id: 'sub1',
          userId: 'user1',
          plan: 'premium',
          status: 'active',
          expiresAt: '2024-12-31T23:59:59Z'
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/user/subscription');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};