export interface LoginValues {
  login: string;
  password: string;
}

export const EMPTY_LOGIN: LoginValues = { login: '', password: '' };

export interface LoginPageState {
  loading: boolean;
  error: string | null;
}