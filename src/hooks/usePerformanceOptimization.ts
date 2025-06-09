
import { useEffect, useState } from 'react';
import { cdnService } from '@/services/cdn/cdnService';
import { compressionService } from '@/services/compression/compressionService';
import { databaseOptimizationService } from '@/services/optimization/databaseOptimizationService';

export interface PerformanceMetrics {
  imageOptimization: {
    totalImages: number;
    optimizedImages: number;
    bytesReduced: number;
  };
  cachePerformance: {
    hitRate: number;
    missRate: number;
    avgResponseTime: number;
  };
  databasePerformance: {
    avgQueryTime: number;
    slowQueries: number;
    indexUsage: number;
  };
}

export const usePerformanceOptimization = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    imageOptimization: {
      totalImages: 0,
      optimizedImages: 0,
      bytesReduced: 0
    },
    cachePerformance: {
      hitRate: 0,
      missRate: 0,
      avgResponseTime: 0
    },
    databasePerformance: {
      avgQueryTime: 0,
      slowQueries: 0,
      indexUsage: 0
    }
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeImages = (imageUrls: string[]) => {
    const optimizedUrls = imageUrls.map(url => 
      cdnService.optimizeImageUrl(url, 300, 'webp')
    );

    setMetrics(prev => ({
      ...prev,
      imageOptimization: {
        totalImages: imageUrls.length,
        optimizedImages: optimizedUrls.length,
        bytesReduced: Math.floor(imageUrls.length * 0.3 * 50000) // Estimated savings
      }
    }));

    return optimizedUrls;
  };

  const preloadCriticalImages = (imageUrls: string[]) => {
    cdnService.preloadCriticalImages(imageUrls);
  };

  const runDatabaseOptimization = async () => {
    setIsOptimizing(true);
    try {
      await databaseOptimizationService.optimizeLocationQueries();
      await databaseOptimizationService.optimizeTextSearchQueries();
      await databaseOptimizationService.runMaintenanceTasks();
    } catch (error) {
      console.error('Database optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getCompressionHeaders = () => {
    return {
      'Accept-Encoding': compressionService.getAcceptEncodingHeader()
    };
  };

  // Initialize optimizations on mount
  useEffect(() => {
    console.log('Performance optimization initialized');
    
    // Run database optimization on app start (development only)
    if (process.env.NODE_ENV === 'development') {
      runDatabaseOptimization();
    }
  }, []);

  return {
    metrics,
    isOptimizing,
    optimizeImages,
    preloadCriticalImages,
    runDatabaseOptimization,
    getCompressionHeaders,
    databaseRecommendations: databaseOptimizationService.getOptimizationRecommendations()
  };
};
