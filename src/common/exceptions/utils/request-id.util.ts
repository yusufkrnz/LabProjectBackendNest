/**
 * Request ID generation ve trace için utility fonksiyonlar
 */
export class RequestIdUtil {
  /**
   * Unique request ID oluştur
   */
  static generate(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Request ID'yi request objesinden al veya oluştur
   */
  static getOrGenerate(request: any): string {
    return request.id || request.requestId || this.generate();
  }

  /**
   * Short request ID oluştur (log için)
   */
  static generateShort(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * UUID benzeri request ID oluştur
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

