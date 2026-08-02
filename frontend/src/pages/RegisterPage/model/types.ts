export interface RegisterValues {
  name: string;
  username: string;
  email?: string;
  password: string;
}

export const EMPTY_REGISTER: RegisterValues = {
  name: '',
  username: '',
  email: '',
  password: '',
};

export interface RegisterPageState {
  loading: boolean;
  error: string | null;
}