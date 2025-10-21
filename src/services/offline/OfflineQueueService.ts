/**
 * Offline Queue Service
 * Manages failed requests and automatic retry when connection is restored
 */

import { indexedDBService } from '../storage/IndexedDBService';

export interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  priority: 'low' | 'normal' | 'high';
  retryCount: number;
  maxRetries: number;
  createdAt: number;
  nextRetryAt: number;
}

class OfflineQueueService {
  private isProcessing = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Listen for online event
    window.addEventListener('online', () => this.processQueue());
  }

  async enqueue(request: Omit<QueuedRequest, 'id' | 'retryCount' | 'createdAt' | 'nextRetryAt'>): Promise<void> {
    const queuedRequest: QueuedRequest = {
      ...request,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retryCount: 0,
      createdAt: Date.now(),
      nextRetryAt: Date.now()
    };

    await indexedDBService.set('offline_queue', queuedRequest.id, queuedRequest);
    this.notifyListeners();

    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || !navigator.onLine) return;

    this.isProcessing = true;

    try {
      const queue = await indexedDBService.getAll<QueuedRequest>('offline_queue');
      const now = Date.now();

      // Sort by priority and time
      const sortedQueue = queue
        .filter(req => req.nextRetryAt <= now)
        .sort((a, b) => {
          const priorityOrder = { high: 0, normal: 1, low: 2 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          return priorityDiff !== 0 ? priorityDiff : a.createdAt - b.createdAt;
        });

      for (const request of sortedQueue) {
        await this.processRequest(request);
      }
    } finally {
      this.isProcessing = false;
      this.notifyListeners();
    }
  }

  private async processRequest(request: QueuedRequest): Promise<void> {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body ? JSON.stringify(request.body) : undefined
      });

      if (response.ok) {
        // Success - remove from queue
        await indexedDBService.delete('offline_queue', request.id);
      } else {
        // Failed - retry logic
        await this.handleFailedRequest(request);
      }
    } catch (error) {
      // Network error - retry logic
      await this.handleFailedRequest(request);
    }
  }

  private async handleFailedRequest(request: QueuedRequest): Promise<void> {
    if (request.retryCount >= request.maxRetries) {
      // Max retries reached - remove from queue
      await indexedDBService.delete('offline_queue', request.id);
      console.error('Max retries reached for request:', request);
      return;
    }

    // Calculate exponential backoff
    const backoffMs = Math.min(1000 * Math.pow(2, request.retryCount), 60000); // Max 1 minute
    
    const updatedRequest: QueuedRequest = {
      ...request,
      retryCount: request.retryCount + 1,
      nextRetryAt: Date.now() + backoffMs
    };

    await indexedDBService.set('offline_queue', request.id, updatedRequest);
  }

  async getStatus(): Promise<{ pending: number; failed: number }> {
    const queue = await indexedDBService.getAll<QueuedRequest>('offline_queue');
    const failed = queue.filter(req => req.retryCount >= req.maxRetries).length;
    
    return {
      pending: queue.length - failed,
      failed
    };
  }

  async clearQueue(): Promise<void> {
    await indexedDBService.clear('offline_queue');
    this.notifyListeners();
  }

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const offlineQueue = new OfflineQueueService();
