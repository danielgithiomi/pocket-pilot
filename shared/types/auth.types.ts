import { User } from "@global/types";

// LOGIN
export interface ILoginRequest {
  email: string;
  password: string;
}

export type IAuthResponse = User;

// REGISTER
export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}
