/**
 * EventBus - Domain Event Communication
 * Enables decoupled communication between domains
 */

export interface DomainEvent {
  type: string;
  payload: any;
  timestamp: number;
  metadata?: {
    userId?: string;
    source?: string;
    correlationId?: string;
  };
}

type EventHandler = (event: DomainEvent) => void | Promise<void>;

class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();
  private eventHistory: DomainEvent[] = [];
  private maxHistorySize = 100;

  /**
   * Subscribe to domain events
   */
  subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    this.handlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Publish domain event
   */
  async publish(event: DomainEvent): Promise<void> {
    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Get handlers for this event type
    const handlers = this.handlers.get(event.type) || new Set();
    
    // Execute all handlers
    const promises = Array.from(handlers).map(handler => 
      Promise.resolve(handler(event)).catch(error => {
        console.error(`Error in event handler for ${event.type}:`, error);
      })
    );

    await Promise.all(promises);
  }

  /**
   * Get event history (for debugging)
   */
  getHistory(eventType?: string): DomainEvent[] {
    if (eventType) {
      return this.eventHistory.filter(e => e.type === eventType);
    }
    return [...this.eventHistory];
  }

  /**
   * Clear all handlers (useful for testing)
   */
  clear(): void {
    this.handlers.clear();
    this.eventHistory = [];
  }
}

// Singleton instance
export const eventBus = new EventBus();
