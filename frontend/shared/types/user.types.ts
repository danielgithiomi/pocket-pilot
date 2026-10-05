import { UserPreferences } from "./onboarding.types";

export interface User {
    id: string;

    firstName: string;
    lastName: string;
    username: string;

    email: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    phoneNumber: string;
    isOnboarded: boolean;
    isAccountLocked: boolean;
    failedLoginAttempts: number;
    profilePictureUrl: string | null;
    userPreferences: UserPreferences;
    profilePictureThumbnailUrl: string | null;
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
    profilePictureAwsKey: string;
    profilePictureThumbnailAwsKey: string;
}
