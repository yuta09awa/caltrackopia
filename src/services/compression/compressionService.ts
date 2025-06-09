
interface CompressionConfig {
  enableGzip: boolean;
  enableBrotli: boolean;
  minSizeBytes: number;
  compressionLevel: number;
}

export class CompressionService {
  private config: CompressionConfig = {
    enableGzip: true,
    enableBrotli: true,
    minSizeBytes: 1024, // 1KB minimum
    compressionLevel: 6
  };

  async compressData(data: any): Promise<ArrayBuffer | string> {
    const jsonString = JSON.stringify(data);
    
    // Don't compress small data
    if (jsonString.length < this.config.minSizeBytes) {
      return jsonString;
    }

    try {
      // Use browser's built-in compression if available
      if ('CompressionStream' in window && this.config.enableGzip) {
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        writer.write(new TextEncoder().encode(jsonString));
        writer.close();
        
        const chunks: Uint8Array[] = [];
        let result;
        
        while (!(result = await reader.read()).done) {
          chunks.push(result.value);
        }
        
        // Combine chunks into single ArrayBuffer
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        
        return combined.buffer;
      }
    } catch (error) {
      console.warn('Compression failed, returning uncompressed data:', error);
    }
    
    return jsonString;
  }

  async decompressData(compressedData: ArrayBuffer | string): Promise<any> {
    if (typeof compressedData === 'string') {
      return JSON.parse(compressedData);
    }

    try {
      if ('DecompressionStream' in window) {
        const stream = new DecompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        writer.write(compressedData);
        writer.close();
        
        const chunks: Uint8Array[] = [];
        let result;
        
        while (!(result = await reader.read()).done) {
          chunks.push(result.value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        
        const jsonString = new TextDecoder().decode(combined);
        return JSON.parse(jsonString);
      }
    } catch (error) {
      console.warn('Decompression failed:', error);
    }
    
    throw new Error('Unable to decompress data');
  }

  getAcceptEncodingHeader(): string {
    const encodings: string[] = [];
    
    if (this.config.enableBrotli && 'DecompressionStream' in window) {
      encodings.push('br');
    }
    
    if (this.config.enableGzip && 'DecompressionStream' in window) {
      encodings.push('gzip');
    }
    
    encodings.push('deflate');
    
    return encodings.join(', ');
  }

  updateConfig(newConfig: Partial<CompressionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const compressionService = new CompressionService();
