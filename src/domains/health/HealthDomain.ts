/**
 * Health Domain Service
 * Handles nutrition tracking and health-related operations
 */

import { eventBus, type DomainEvent } from '../core/EventBus';
import type { NutritionalInfo } from '@/entities/nutrition';

export const HealthEvents = {
  MEAL_LOGGED: 'health.meal.logged',
  NUTRITION_CALCULATED: 'health.nutrition.calculated',
  GOAL_UPDATED: 'health.goal.updated',
} as const;

export interface MealLoggedEvent extends DomainEvent {
  type: typeof HealthEvents.MEAL_LOGGED;
  payload: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    items: string[];
    totalCalories: number;
  };
}

export interface NutritionCalculatedEvent extends DomainEvent {
  type: typeof HealthEvents.NUTRITION_CALCULATED;
  payload: {
    nutrition: NutritionalInfo;
    source: string;
  };
}

class HealthDomain {
  /**
   * Calculate nutrition for cart items
   */
  async calculateCartNutrition(items: Array<{ name: string; quantity: number }>): Promise<NutritionalInfo> {
    // Placeholder for nutrition calculation
    // This would integrate with nutrition APIs in Phase 3
    const nutrition: NutritionalInfo = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    };

    await eventBus.publish({
      type: HealthEvents.NUTRITION_CALCULATED,
      payload: {
        nutrition,
        source: 'cart',
      },
      timestamp: Date.now(),
    });

    return nutrition;
  }

  /**
   * Log a meal
   */
  async logMeal(params: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    items: string[];
    nutrition: NutritionalInfo;
  }): Promise<void> {
    await eventBus.publish({
      type: HealthEvents.MEAL_LOGGED,
      payload: {
        mealType: params.mealType,
        items: params.items,
        totalCalories: params.nutrition.calories,
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe to cart events for nutrition tracking
   */
  subscribeToCartEvents(): void {
    eventBus.subscribe('cart.item.added', async (event) => {
      console.log('Health domain: Cart item added', event.payload);
      // Could trigger nutrition calculation here
    });

    eventBus.subscribe('cart.checkout.started', async (event) => {
      console.log('Health domain: Checkout started', event.payload);
      // Could log meal or update nutrition goals
    });
  }
}

export const healthDomain = new HealthDomain();

// Initialize event subscriptions
healthDomain.subscribeToCartEvents();
