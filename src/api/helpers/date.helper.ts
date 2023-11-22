export class CalculateDateHelper {
  static getCalculatedDate() {
    const dateNow = new Date();
    const calculateExpiresIn = dateNow.setDate(
      dateNow.getDate() + Number(process.env.REFRESH_TOKEN_EXPIRATION),
    );
    const expiresIn = new Date(calculateExpiresIn);

    return expiresIn;
  }
}
