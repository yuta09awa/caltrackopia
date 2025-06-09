
import { toast } from "sonner";

export interface CDNConfig {
  baseUrl: string;
  imageSizes: number[];
  formats: string[];
  enableWebP: boolean;
  enableCompression: boolean;
}

export class CDNService {
  private config: CDNConfig = {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://cdn.example.com' : '',
    imageSizes: [150, 300, 600, 1200],
    formats: ['webp', 'jpg', 'png'],
    enableWebP: true,
    enableCompression: true
  };

  optimizeImageUrl(originalUrl: string, size?: number, format?: string): string {
    if (!originalUrl || originalUrl.startsWith('data:')) {
      return originalUrl;
    }

    // Handle local development
    if (process.env.NODE_ENV === 'development' || !this.config.baseUrl) {
      return originalUrl;
    }

    try {
      const url = new URL(originalUrl);
      const params = new URLSearchParams();
      
      if (size && this.config.imageSizes.includes(size)) {
        params.set('w', size.toString());
        params.set('h', size.toString());
        params.set('fit', 'cover');
      }

      if (format && this.config.formats.includes(format)) {
        params.set('f', format);
      } else if (this.config.enableWebP) {
        params.set('f', 'webp');
      }

      if (this.config.enableCompression) {
        params.set('q', '85'); // Quality setting
      }

      const optimizedUrl = `${this.config.baseUrl}/${encodeURIComponent(originalUrl)}`;
      return params.toString() ? `${optimizedUrl}?${params.toString()}` : optimizedUrl;
    } catch (error) {
      console.warn('Failed to optimize image URL:', error);
      return originalUrl;
    }
  }

  preloadCriticalImages(imageUrls: string[]): void {
    imageUrls.forEach(url => {
      const optimizedUrl = this.optimizeImageUrl(url, 300);
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedUrl;
      document.head.appendChild(link);
    });
  }

  getResponsiveImageSrcSet(originalUrl: string): string {
    if (!originalUrl || originalUrl.startsWith('data:')) {
      return originalUrl;
    }

    return this.config.imageSizes
      .map(size => `${this.optimizeImageUrl(originalUrl, size)} ${size}w`)
      .join(', ');
  }

  updateConfig(newConfig: Partial<CDNConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('CDN config updated:', this.config);
  }
}

export const cdnService = new CDNService();
