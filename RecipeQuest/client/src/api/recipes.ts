import api from './api';

export interface Recipe {
  _id: string;
  name: string;
  description: string;
  image: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  servings: number;
  prepTime: number;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
}

export interface Ingredient {
  _id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface Store {
  _id: string;
  name: string;
  chain: string;
  address: string;
  phone: string;
  distance: number;
  hours: string;
  availableIngredients: string[];
  latitude: number;
  longitude: number;
}

// Description: Get all recipes with optional filters
// Endpoint: GET /api/recipes
// Request: { search?: string, cuisine?: string, difficulty?: string, maxTime?: number }
// Response: { recipes: Recipe[] }
export const getRecipes = (filters?: { search?: string; cuisine?: string; difficulty?: string; maxTime?: number }) => {
  console.log("Fetching recipes with filters:", filters);
  
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recipes: [
          {
            _id: '1',
            name: 'Spaghetti Carbonara',
            description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
            image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop&auto=format',
            cookingTime: 25,
            difficulty: 'Medium',
            cuisine: 'Italian',
            servings: 4,
            prepTime: 10,
            ingredients: [
              { _id: 'i1', name: 'Spaghetti', quantity: '400', unit: 'g' },
              { _id: 'i2', name: 'Pancetta', quantity: '150', unit: 'g' },
              { _id: 'i3', name: 'Eggs', quantity: '3', unit: 'large' },
              { _id: 'i4', name: 'Parmesan cheese', quantity: '100', unit: 'g' },
              { _id: 'i5', name: 'Black pepper', quantity: '1', unit: 'tsp' }
            ],
            instructions: [
              'Cook spaghetti according to package directions',
              'Fry pancetta until crispy',
              'Beat eggs with grated parmesan',
              'Combine hot pasta with pancetta',
              'Add egg mixture and toss quickly',
              'Season with black pepper and serve'
            ],
            tags: ['pasta', 'italian', 'quick']
          },
          {
            _id: '2',
            name: 'Chicken Teriyaki Bowl',
            description: 'Japanese-inspired chicken bowl with steamed rice and vegetables',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format',
            cookingTime: 30,
            difficulty: 'Easy',
            cuisine: 'Japanese',
            servings: 2,
            prepTime: 15,
            ingredients: [
              { _id: 'i6', name: 'Chicken breast', quantity: '500', unit: 'g' },
              { _id: 'i7', name: 'Soy sauce', quantity: '3', unit: 'tbsp' },
              { _id: 'i8', name: 'Mirin', quantity: '2', unit: 'tbsp' },
              { _id: 'i9', name: 'Brown sugar', quantity: '1', unit: 'tbsp' },
              { _id: 'i10', name: 'Jasmine rice', quantity: '1', unit: 'cup' }
            ],
            instructions: [
              'Cook rice according to package directions',
              'Cut chicken into bite-sized pieces',
              'Mix soy sauce, mirin, and brown sugar',
              'Cook chicken until golden',
              'Add sauce and simmer until glazed',
              'Serve over rice with vegetables'
            ],
            tags: ['chicken', 'japanese', 'healthy']
          },
          {
            _id: '3',
            name: 'Beef Tacos',
            description: 'Authentic Mexican street tacos with seasoned ground beef',
            image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop&auto=format',
            cookingTime: 20,
            difficulty: 'Easy',
            cuisine: 'Mexican',
            servings: 4,
            prepTime: 10,
            ingredients: [
              { _id: 'i11', name: 'Ground beef', quantity: '500', unit: 'g' },
              { _id: 'i12', name: 'Corn tortillas', quantity: '8', unit: 'pieces' },
              { _id: 'i13', name: 'Onion', quantity: '1', unit: 'medium' },
              { _id: 'i14', name: 'Cilantro', quantity: '1', unit: 'bunch' },
              { _id: 'i15', name: 'Lime', quantity: '2', unit: 'pieces' }
            ],
            instructions: [
              'Brown ground beef in a large pan',
              'Add diced onion and cook until soft',
              'Season with cumin, chili powder, and salt',
              'Warm tortillas in a dry pan',
              'Fill tortillas with beef mixture',
              'Top with cilantro and lime juice'
            ],
            tags: ['beef', 'mexican', 'quick']
          },
          {
            _id: '4',
            name: 'Thai Green Curry',
            description: 'Aromatic Thai curry with coconut milk and fresh herbs',
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&auto=format',
            cookingTime: 35,
            difficulty: 'Medium',
            cuisine: 'Thai',
            servings: 4,
            prepTime: 20,
            ingredients: [
              { _id: 'i16', name: 'Chicken thigh', quantity: '600', unit: 'g' },
              { _id: 'i17', name: 'Coconut milk', quantity: '400', unit: 'ml' },
              { _id: 'i18', name: 'Green curry paste', quantity: '3', unit: 'tbsp' },
              { _id: 'i19', name: 'Thai basil', quantity: '1', unit: 'bunch' },
              { _id: 'i20', name: 'Eggplant', quantity: '2', unit: 'small' }
            ],
            instructions: [
              'Heat coconut milk in a large pot',
              'Add curry paste and stir until fragrant',
              'Add chicken and cook until done',
              'Add eggplant and simmer',
              'Season with fish sauce and sugar',
              'Garnish with Thai basil leaves'
            ],
            tags: ['curry', 'thai', 'spicy']
          },
          {
            _id: '5',
            name: 'Mediterranean Salad',
            description: 'Fresh and healthy salad with feta cheese and olives',
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format',
            cookingTime: 15,
            difficulty: 'Easy',
            cuisine: 'Mediterranean',
            servings: 2,
            prepTime: 15,
            ingredients: [
              { _id: 'i21', name: 'Mixed greens', quantity: '200', unit: 'g' },
              { _id: 'i22', name: 'Feta cheese', quantity: '100', unit: 'g' },
              { _id: 'i23', name: 'Kalamata olives', quantity: '50', unit: 'g' },
              { _id: 'i24', name: 'Cherry tomatoes', quantity: '200', unit: 'g' },
              { _id: 'i25', name: 'Olive oil', quantity: '3', unit: 'tbsp' }
            ],
            instructions: [
              'Wash and dry mixed greens',
              'Halve cherry tomatoes',
              'Crumble feta cheese',
              'Combine all ingredients in a bowl',
              'Drizzle with olive oil and lemon',
              'Toss gently and serve immediately'
            ],
            tags: ['salad', 'healthy', 'vegetarian']
          },
          {
            _id: '6',
            name: 'Chocolate Chip Cookies',
            description: 'Classic homemade cookies with chocolate chips',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&auto=format',
            cookingTime: 25,
            difficulty: 'Easy',
            cuisine: 'American',
            servings: 24,
            prepTime: 15,
            ingredients: [
              { _id: 'i26', name: 'All-purpose flour', quantity: '2', unit: 'cups' },
              { _id: 'i27', name: 'Butter', quantity: '1', unit: 'cup' },
              { _id: 'i28', name: 'Brown sugar', quantity: '3/4', unit: 'cup' },
              { _id: 'i29', name: 'Chocolate chips', quantity: '2', unit: 'cups' },
              { _id: 'i30', name: 'Vanilla extract', quantity: '1', unit: 'tsp' }
            ],
            instructions: [
              'Preheat oven to 375°F (190°C)',
              'Cream butter and sugars together',
              'Add eggs and vanilla extract',
              'Mix in flour gradually',
              'Fold in chocolate chips',
              'Bake for 9-11 minutes until golden'
            ],
            tags: ['dessert', 'cookies', 'baking']
          }
        ]
      });
    }, 500);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/recipes', { params: filters });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get a single recipe by ID
// Endpoint: GET /api/recipes/:id
// Request: { id: string }
// Response: { recipe: Recipe }
export const getRecipeById = (id: string) => {
  console.log("Fetching recipe with ID:", id);
  
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const recipes = [
        {
          _id: '1',
          name: 'Spaghetti Carbonara',
          description: 'Classic Italian pasta dish with eggs, cheese, and pancetta. This traditional Roman recipe is simple yet elegant, requiring just a few high-quality ingredients to create a creamy, satisfying meal.',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop&auto=format',
          cookingTime: 25,
          difficulty: 'Medium',
          cuisine: 'Italian',
          servings: 4,
          prepTime: 10,
          ingredients: [
            { _id: 'i1', name: 'Spaghetti', quantity: '400', unit: 'g' },
            { _id: 'i2', name: 'Pancetta', quantity: '150', unit: 'g' },
            { _id: 'i3', name: 'Large eggs', quantity: '3', unit: 'pieces' },
            { _id: 'i4', name: 'Parmesan cheese (grated)', quantity: '100', unit: 'g' },
            { _id: 'i5', name: 'Black pepper (freshly ground)', quantity: '1', unit: 'tsp' },
            { _id: 'i6', name: 'Salt', quantity: '1', unit: 'tsp' }
          ],
          instructions: [
            'Bring a large pot of salted water to boil and cook spaghetti according to package directions until al dente.',
            'While pasta cooks, cut pancetta into small cubes and fry in a large pan until crispy and golden.',
            'In a bowl, beat eggs with grated parmesan cheese and freshly ground black pepper.',
            'Reserve 1 cup of pasta cooking water before draining the spaghetti.',
            'Add hot, drained pasta to the pan with pancetta and toss to combine.',
            'Remove from heat and quickly add the egg mixture, tossing constantly to create a creamy sauce.',
            'Add pasta water gradually if needed to achieve desired consistency.',
            'Serve immediately with extra parmesan and black pepper.'
          ],
          tags: ['pasta', 'italian', 'quick', 'traditional']
        }
      ];
      
      const recipe = recipes.find(r => r._id === id) || recipes[0];
      resolve({ recipe });
    }, 500);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/recipes/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Find nearby stores with ingredients
// Endpoint: POST /api/stores/nearby
// Request: { latitude: number, longitude: number, ingredients: string[] }
// Response: { stores: Store[] }
export const findNearbyStores = (data: { latitude: number; longitude: number; ingredients: string[] }) => {
  console.log("Finding nearby stores for location:", data.latitude, data.longitude);
  console.log("Looking for ingredients:", data.ingredients);
  
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stores: [
          {
            _id: 's1',
            name: 'Fresh Market Downtown',
            chain: 'Fresh Market',
            address: '123 Main St, Downtown',
            phone: '(555) 123-4567',
            distance: 0.8,
            hours: '7:00 AM - 10:00 PM',
            availableIngredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Parmesan cheese'],
            latitude: 40.7128,
            longitude: -74.0060
          },
          {
            _id: 's2',
            name: 'SuperMart Plus',
            chain: 'SuperMart',
            address: '456 Oak Avenue, Midtown',
            phone: '(555) 987-6543',
            distance: 1.2,
            hours: '6:00 AM - 11:00 PM',
            availableIngredients: ['Spaghetti', 'Eggs', 'Parmesan cheese', 'Black pepper'],
            latitude: 40.7589,
            longitude: -73.9851
          },
          {
            _id: 's3',
            name: 'Organic Foods Co-op',
            chain: 'Independent',
            address: '789 Green Street, Uptown',
            phone: '(555) 456-7890',
            distance: 2.1,
            hours: '8:00 AM - 9:00 PM',
            availableIngredients: ['Pancetta', 'Eggs', 'Parmesan cheese', 'Black pepper'],
            latitude: 40.7831,
            longitude: -73.9712
          }
        ]
      });
    }, 800);
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/stores/nearby', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};