import { Inject, Service } from "typedi";
import { AuthResponse, LoginRequest, UserDataResponse } from "../models/loginRequest";
import { AuthenticationProvider } from "../providers/authenticationProvider";
import { FirstPasswordRequest } from "../models/firstPasswordRequest";

@Service("authenticationService")
export class AuthenticationService {
  private authenticationProvider: AuthenticationProvider;

  public constructor(
    @Inject("authenticationProvider") authenticationProvider: AuthenticationProvider,
  ) {
    this.authenticationProvider = authenticationProvider;
  }

  public async login(email: string, password: string): Promise<UserDataResponse> {
    const loginData: LoginRequest = { email, password };
    const authResponse: AuthResponse = await this.authenticationProvider.login(loginData);

    return Object.assign({
      ...authResponse,
    });
  }

  public async logout(accessToken: string): Promise<void> {
    const logout = await this.authenticationProvider.logout(accessToken);

    await Promise.all([logout, event]);
  }

  public async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const authResponse: AuthResponse = await this.authenticationProvider.refreshToken(refreshToken);
    return authResponse;
  }

  public async firstPassword(email: string, password: string, confirmationCode: string): Promise<AuthResponse> {
    const firstPasswordData: FirstPasswordRequest = { email, password, confirmationCode };
    return await this.authenticationProvider.firstPassword(firstPasswordData);
  }
}
