import * as bcrypt from 'bcrypt';

export class PasswordHashHelper {
  static async generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 5);
    return hash;
  }
}
