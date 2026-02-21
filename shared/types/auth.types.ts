// LOGIN
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
