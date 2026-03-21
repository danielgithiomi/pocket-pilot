import { User } from "../types/user.types";

// LOGIN
export interface ILoginRequest {
  email: string;
  password: string;
}

export type IAuthResponse = User;