export type UserType = 'particulier' | 'professionnel' | 'admin' | 'unknown';

export interface User {
  password: string;
  id: string;
  email: string;
  isLoggedIn: boolean;
  userType: UserType;
  fullName: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
  permissions: string[];
  role: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  userType: UserType;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface PasswordResetData {
  token: string;
  password: string;
}