import * as bcrypt from 'bcrypt';


export class PasswordUtil {
  // Salt rounds sabiti (güvenlik seviyesi)
  // salt rounds: şifre hash'leme işleminde kullanılan bir parametre direkt hashlense
  // hashlerin kontrolü zorlaşır 
  // ondan salt ekleniyormuş ve compare olayıda bu özel işlemi gerçekleştiriyor
  // compare boolen dönüyor ondan dönüş olarak bool döndük . 
  private static readonly SALT_ROUNDS = 12;

  // Şifre hash'leme metodu
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Şifre doğrulama metodu
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Şifre güçlülük kontrolü
  static isPasswordStrong(password: string): boolean {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumbers;
  }
}