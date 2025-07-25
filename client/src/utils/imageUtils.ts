// utils/imageUtils.ts - Create this file

// Option 1: Convert base64 to Blob URL (temporary, session-based)
export function convertBase64ToBlobUrl(base64: string): string {
  try {
    // Extract the actual base64 data
    const base64Data = base64.split(',')[1];
    const mimeType = base64.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
    
    // Convert to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    // Create blob URL
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    return base64; // fallback to original
  }
}

// Option 2: Compress image before storing
export function compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Option 3: Store images in IndexedDB with references
class ImageStorage {
  private dbName = 'EditorImages';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
      };
    });
  }

  async storeImage(base64: string): Promise<string> {
    if (!this.db) await this.init();
    
    const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      
      store.add({ id, data: base64 });
      
      transaction.oncomplete = () => resolve(id);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getImage(id: string): Promise<string | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get(id);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const imageStorage = new ImageStorage();