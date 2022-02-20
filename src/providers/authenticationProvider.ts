import { User } from "../models/user";
import { LoginRequest, AuthResponse } from "../models/loginRequest";
import { FirstPasswordRequest } from "../models/firstPasswordRequest";
export interface AuthenticationProvider {
  login(loginData: LoginRequest): Promise<AuthResponse>;
  logout(accessToken: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  firstPassword(firstPasswordData: FirstPasswordRequest): Promise<AuthResponse>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  blockUser(user: User): Promise<User>;
  unblockUser(user: User): Promise<User>;
  forgotPassword(user: User): Promise<User>;
}
