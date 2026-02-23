// LOGIN
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// REGISTER
export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}
