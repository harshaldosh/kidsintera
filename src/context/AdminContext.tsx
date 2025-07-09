import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan, Coupon, UserProfile, UserStats, FlashcardCategory, Flashcard } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

interface AdminContextType {
  // Plans
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlan: (id: string, updates: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  getPlanById: (id: string) => Plan | undefined;
  
  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  getCouponByCode: (code: string) => Coupon | undefined;
  
  // Flashcard Categories
  categories: FlashcardCategory[];
  addCategory: (category: Omit<FlashcardCategory, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<FlashcardCategory>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => FlashcardCategory | undefined;
  
  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  getFlashcardById: (id: string) => Flashcard | undefined;
  getFlashcardsByCategory: (categoryId: string) => Flashcard[];
  
  // Users
  users: UserProfile[];
  getUserStats: (userId: string) => UserStats;
  updateUserStatus: (userId: string, isActive: boolean) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
  
  // Admin verification
  isAdmin: (email: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('admin_plans');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default plans
    const defaultPlans: Plan[] = [
      {
        id: uuidv4(),
        name: 'Free',
        description: 'Perfect for getting started',
        price: 0,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: {
          todoboardEnabled: true,
          customDomain: false,
          prioritySupport: false,
        },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: uuidv4(),
        name: 'Pro',
        description: 'For professional users',
        price: 29,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: {
          todoboardEnabled: true,
          customDomain: true,
          prioritySupport: true,
        },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: uuidv4(),
        name: 'Enterprise',
        description: 'For teams and organizations',
        price: 99,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: {
          todoboardEnabled: true,
          customDomain: true,
          prioritySupport: true,
        },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    
    return defaultPlans;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('admin_coupons');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('admin_users');
    return saved ? JSON.parse(saved) : [];
  });

  // Flashcard Categories
  const [categories, setCategories] = useState<FlashcardCategory[]>(() => {
    const saved = localStorage.getItem('admin_categories');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default categories
    const defaultCategories: FlashcardCategory[] = [
      {
        id: 'animals',
        name: 'Animals',
        description: 'Learn about different animals and their sounds',
        color: '#10B981',
        icon: '🐾',
        ageGroup: '3-4 years',
        modelUrl: 'https://example.com/models/animals-model.json', // Example fine-tuned model
        createdAt: Date.now(),
      },
      {
        id: 'colors',
        name: 'Colors',
        description: 'Discover beautiful colors around us',
        color: '#8B5CF6',
        icon: '🎨',
        ageGroup: '3-4 years',
        createdAt: Date.now(),
      },
      {
        id: 'shapes',
        name: 'Shapes',
        description: 'Learn basic shapes and geometry',
        color: '#F59E0B',
        icon: '🔷',
        ageGroup: '3-4 years',
        createdAt: Date.now(),
      },
      {
        id: 'numbers',
        name: 'Numbers',
        description: 'Count and learn numbers 1-10',
        color: '#EF4444',
        icon: '🔢',
        ageGroup: '3-4 years',
        createdAt: Date.now(),
      },
    ];
    
    return defaultCategories;
  });

  // Flashcards
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('admin_flashcards');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default flashcards
    const defaultFlashcards: Flashcard[] = [
      // Animals
      {
        id: 'cat',
        categoryId: 'animals',
        title: 'Cat',
        description: 'A cute furry pet that says meow',
        imageUrl: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/cat-meow.mp3',
        pronunciation: 'kat',
        spelling: 'c-a-t',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'dog',
        categoryId: 'animals',
        title: 'Dog',
        description: 'A loyal friend that says woof',
        imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/dog-bark.mp3',
        pronunciation: 'dawg',
        spelling: 'd-o-g',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'cow',
        categoryId: 'animals',
        title: 'Cow',
        description: 'A farm animal that says moo',
        imageUrl: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/cow-moo.mp3',
        pronunciation: 'kow',
        spelling: 'c-o-w',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'duck',
        categoryId: 'animals',
        title: 'Duck',
        description: 'A water bird that says quack',
        imageUrl: 'https://images.pexels.com/photos/133459/pexels-photo-133459.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/duck-quack.mp3',
        pronunciation: 'duhk',
        spelling: 'd-u-c-k',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      
      // Colors
      {
        id: 'red',
        categoryId: 'colors',
        title: 'Red',
        description: 'The color of apples and fire trucks',
        imageUrl: 'https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/red.mp3',
        pronunciation: 'red',
        spelling: 'r-e-d',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'blue',
        categoryId: 'colors',
        title: 'Blue',
        description: 'The color of the sky and ocean',
        imageUrl: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/blue.mp3',
        pronunciation: 'bloo',
        spelling: 'b-l-u-e',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'yellow',
        categoryId: 'colors',
        title: 'Yellow',
        description: 'The color of the sun and bananas',
        imageUrl: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/yellow.mp3',
        pronunciation: 'yel-oh',
        spelling: 'y-e-l-l-o-w',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'green',
        categoryId: 'colors',
        title: 'Green',
        description: 'The color of grass and leaves',
        imageUrl: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/green.mp3',
        pronunciation: 'green',
        spelling: 'g-r-e-e-n',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      
      // Shapes
      {
        id: 'circle',
        categoryId: 'shapes',
        title: 'Circle',
        description: 'A round shape with no corners',
        imageUrl: 'https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/circle.mp3',
        pronunciation: 'sur-kul',
        spelling: 'c-i-r-c-l-e',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'square',
        categoryId: 'shapes',
        title: 'Square',
        description: 'A shape with four equal sides',
        imageUrl: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/square.mp3',
        pronunciation: 'skwair',
        spelling: 's-q-u-a-r-e',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'triangle',
        categoryId: 'shapes',
        title: 'Triangle',
        description: 'A shape with three sides',
        imageUrl: 'https://images.pexels.com/photos/1029624/pexels-photo-1029624.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/triangle.mp3',
        pronunciation: 'try-ang-gul',
        spelling: 't-r-i-a-n-g-l-e',
        difficulty: 'medium',
        createdAt: Date.now(),
      },
      {
        id: 'star',
        categoryId: 'shapes',
        title: 'Star',
        description: 'A shape with five points',
        imageUrl: 'https://images.pexels.com/photos/1252814/pexels-photo-1252814.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/star.mp3',
        pronunciation: 'star',
        spelling: 's-t-a-r',
        difficulty: 'medium',
        createdAt: Date.now(),
      },
      
      // Numbers
      {
        id: 'one',
        categoryId: 'numbers',
        title: 'One',
        description: 'The number 1',
        imageUrl: 'https://images.pexels.com/photos/1329296/pexels-photo-1329296.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/one.mp3',
        pronunciation: 'wuhn',
        spelling: 'o-n-e',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'two',
        categoryId: 'numbers',
        title: 'Two',
        description: 'The number 2',
        imageUrl: 'https://images.pexels.com/photos/1329297/pexels-photo-1329297.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/two.mp3',
        pronunciation: 'too',
        spelling: 't-w-o',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'three',
        categoryId: 'numbers',
        title: 'Three',
        description: 'The number 3',
        imageUrl: 'https://images.pexels.com/photos/1329298/pexels-photo-1329298.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/three.mp3',
        pronunciation: 'three',
        spelling: 't-h-r-e-e',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
      {
        id: 'four',
        categoryId: 'numbers',
        title: 'Four',
        description: 'The number 4',
        imageUrl: 'https://images.pexels.com/photos/1329299/pexels-photo-1329299.jpeg?auto=compress&cs=tinysrgb&w=400',
        soundUrl: '/sounds/four.mp3',
        pronunciation: 'for',
        spelling: 'f-o-u-r',
        difficulty: 'easy',
        createdAt: Date.now(),
      },
    ];
    
    return defaultFlashcards;
  });
  useEffect(() => {
    localStorage.setItem('admin_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('admin_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('admin_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);
  const addPlan = (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlan: Plan = {
      ...plan,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setPlans(prev => [...prev, newPlan]);
    toast.success('Plan added successfully');
  };

  const updatePlan = (id: string, updates: Partial<Plan>) => {
    setPlans(prev =>
      prev.map(plan =>
        plan.id === id ? { ...plan, ...updates, updatedAt: Date.now() } : plan
      )
    );
    toast.success('Plan updated successfully');
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
    toast.success('Plan deleted successfully');
  };

  const getPlanById = (id: string) => {
    return plans.find(plan => plan.id === id);
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: uuidv4(),
      usedCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCoupons(prev => [...prev, newCoupon]);
    toast.success('Coupon added successfully');
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev =>
      prev.map(coupon =>
        coupon.id === id ? { ...coupon, ...updates, updatedAt: Date.now() } : coupon
      )
    );
    toast.success('Coupon updated successfully');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== id));
    toast.success('Coupon deleted successfully');
  };

  const getCouponByCode = (code: string) => {
    return coupons.find(coupon => 
      coupon.code.toLowerCase() === code.toLowerCase() && 
      coupon.isActive &&
      (!coupon.expiresAt || coupon.expiresAt > Date.now()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
    );
  };

  // Category management functions
  const addCategory = (category: Omit<FlashcardCategory, 'id' | 'createdAt'>) => {
    const newCategory: FlashcardCategory = {
      ...category,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success('Category added successfully');
  };

  const updateCategory = (id: string, updates: Partial<FlashcardCategory>) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
    toast.success('Category updated successfully');
  };

  const deleteCategory = (id: string) => {
    // Also delete all flashcards in this category
    setFlashcards(prev => prev.filter(flashcard => flashcard.categoryId !== id));
    setCategories(prev => prev.filter(category => category.id !== id));
    toast.success('Category and associated flashcards deleted successfully');
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  // Flashcard management functions
  const addFlashcard = (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    setFlashcards(prev => [...prev, newFlashcard]);
    toast.success('Flashcard added successfully');
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards(prev =>
      prev.map(flashcard =>
        flashcard.id === id ? { ...flashcard, ...updates } : flashcard
      )
    );
    toast.success('Flashcard updated successfully');
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(flashcard => flashcard.id !== id));
    toast.success('Flashcard deleted successfully');
  };

  const getFlashcardById = (id: string) => {
    return flashcards.find(flashcard => flashcard.id === id);
  };

  const getFlashcardsByCategory = (categoryId: string) => {
    return flashcards.filter(flashcard => flashcard.categoryId === categoryId);
  };
  const getUserStats = (userId: string): UserStats => {
    // This would typically fetch from a database
    // For now, return mock data
    return {
      totalTodos: 15,
      completedTodos: 10,
    };
  };

  const updateUserStatus = (userId: string, isActive: boolean) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, isActive } : user
      )
    );
    toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
  };

  const resetUserPassword = (userId: string, newPassword: string) => {
    // This would typically call an API to reset the password
    toast.success('Password reset successfully');
  };

  const isAdmin = (email: string) => {
    return email === 'admin@admin.com' || email === 'admin@demo.com';
  };

  return (
    <AdminContext.Provider
      value={{
        plans,
        addPlan,
        updatePlan,
        deletePlan,
        getPlanById,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        getCouponByCode,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        flashcards,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        getFlashcardById,
        getFlashcardsByCategory,
        users,
        getUserStats,
        updateUserStatus,
        resetUserPassword,
        isAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};