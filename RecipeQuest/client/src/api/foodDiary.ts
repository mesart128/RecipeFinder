import api from './api';

export interface FoodEntry {
  _id: string;
  userId: string;
  date: string; // ISO date string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entries: FoodEntry[];
}

// Description: Get food entries for a specific date
// Endpoint: GET /api/food-diary/:date
// Request: { date: string }
// Response: { entries: FoodEntry[], nutrition: DailyNutrition }
export const getFoodEntriesForDate = (date: string) => {
  console.log("Fetching food entries for date:", date);

  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        entries: [
          {
            _id: 'entry1',
            userId: 'user1',
            date: date,
            mealType: 'breakfast',
            foodName: 'Oatmeal with berries',
            quantity: 1,
            unit: 'bowl',
            calories: 350,
            protein: 12,
            carbs: 65,
            fat: 8,
            notes: 'With almond milk',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: 'entry2',
            userId: 'user1',
            date: date,
            mealType: 'lunch',
            foodName: 'Grilled chicken salad',
            quantity: 1,
            unit: 'serving',
            calories: 420,
            protein: 35,
            carbs: 15,
            fat: 22,
            notes: 'With olive oil dressing',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        nutrition: {
          date: date,
          totalCalories: 770,
          totalProtein: 47,
          totalCarbs: 80,
          totalFat: 30,
          entries: []
        }
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/food-diary/${date}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Add a new food entry
// Endpoint: POST /api/food-diary
// Request: { entry: Partial<FoodEntry> }
// Response: { entry: FoodEntry, message: string }
export const addFoodEntry = (entryData: Partial<FoodEntry>) => {
  console.log("Adding food entry:", entryData);

  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        entry: {
          _id: `entry_${Date.now()}`,
          userId: 'user1',
          ...entryData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        message: 'Food entry added successfully'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/food-diary', { entry: entryData });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update a food entry
// Endpoint: PUT /api/food-diary/:id
// Request: { entry: Partial<FoodEntry> }
// Response: { entry: FoodEntry, message: string }
export const updateFoodEntry = (id: string, entryData: Partial<FoodEntry>) => {
  console.log("Updating food entry:", id, entryData);

  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        entry: {
          _id: id,
          userId: 'user1',
          ...entryData,
          updatedAt: new Date().toISOString()
        },
        message: 'Food entry updated successfully'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/food-diary/${id}`, { entry: entryData });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Delete a food entry
// Endpoint: DELETE /api/food-diary/:id
// Request: {}
// Response: { message: string }
export const deleteFoodEntry = (id: string) => {
  console.log("Deleting food entry:", id);

  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Food entry deleted successfully'
      });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/food-diary/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get nutrition summary for a date range
// Endpoint: GET /api/food-diary/nutrition-summary
// Request: { startDate: string, endDate: string }
// Response: { summary: { [date: string]: DailyNutrition } }
export const getNutritionSummary = (startDate: string, endDate: string) => {
  console.log("Getting nutrition summary from", startDate, "to", endDate);

  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const summary: { [date: string]: DailyNutrition } = {};
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        summary[dateStr] = {
          date: dateStr,
          totalCalories: Math.floor(Math.random() * 1000) + 1500,
          totalProtein: Math.floor(Math.random() * 50) + 50,
          totalCarbs: Math.floor(Math.random() * 100) + 150,
          totalFat: Math.floor(Math.random() * 30) + 40,
          entries: []
        };
      }

      resolve({ summary });
    }, 800);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/food-diary/nutrition-summary', { params: { startDate, endDate } });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};