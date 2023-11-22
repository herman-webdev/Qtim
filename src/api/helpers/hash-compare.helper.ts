import * as bcrypt from 'bcrypt';

export class PasswordHashCompareHelper {
  static async makeCompare(
    reqPassword: string,
    password: string,
  ): Promise<boolean> {
    const checkPassword = await bcrypt.compare(reqPassword, password);
    return checkPassword;
  }
}
