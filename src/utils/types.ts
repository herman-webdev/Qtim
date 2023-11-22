export interface ApiSignupResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
}

export interface ApiSigninResponse {
  accessToken: string;
  refreshToken: string;
}
