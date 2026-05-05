import { UserPreferences } from "./onboarding.types";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  phoneNumber: string;
  isOnboarded: boolean;
  isAccountLocked: boolean;
  profilePictureUrl: string;
  failedLoginAttempts: number;
  userPreferences: UserPreferences;
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
  phoneNumber: string;
}

export interface IChangePasswordRequest {
  newPassword: string;
  currentPassword: string;
}

export interface IUpdateUserProfilePictureRequest {
  profilePictureKey: string;
}

