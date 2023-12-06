import { NewsDTO } from '../api/NewsDto/news.dto';

export interface ApiSignupResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
}

export interface ApiSigninResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiGetAllNewsResponse {
  news: NewsDTO[];
}

export interface ApiCreateNewsResponse {
  id: string;
}

export interface ApiUpdateNewsResponse {
  id: string;
}

export interface ApiDeleteNewsResponse {
  id: string;
}
