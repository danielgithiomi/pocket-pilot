export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  isAccountLocked: boolean;
  failedLoginAttempts: number;
}

// REGISTER
export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

// UPDATE
export interface IUpdateUserRequest {
  name: string;
  email: string;
}
