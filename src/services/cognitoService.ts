import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Inject, Service } from "typedi";
import { User } from "../models/user";
import {
  AdminGetUserResponse,
  AuthFlowType,
  AuthParametersType,
  ChallengeNameType,
  InitiateAuthResponse,
  RespondToAuthChallengeResponse,
} from "aws-sdk/clients/cognitoidentityserviceprovider";
import {
  AccessTokenException,
  CognitoException,
  InvalidLoginData,
  InvalidParameterException,
  ChangePasswordException,
} from "../errors/authErrors";
import { LoginRequest, AuthResponse } from "../models/loginRequest";
import { AuthenticationProvider } from "../providers/authenticationProvider";
import { FirstPasswordRequest } from "../models/firstPasswordRequest";
@Service("authenticationProvider")
export class CognitoService implements AuthenticationProvider {
  private cognito: CognitoIdentityServiceProvider;
  private userPoolId: string;
  private clientId: string;
  private ignorePrefix: string;

  public constructor(
    @Inject("cognitoSDK") cognito: CognitoIdentityServiceProvider,
    @Inject("userPoolId") userPoolId: string,
    @Inject("clientId") clientId: string,
    @Inject("ignorePrefix") ignorePrefix: string
  ) {
    this.cognito = cognito;
    this.userPoolId = userPoolId;
    this.clientId = clientId;
    this.ignorePrefix = ignorePrefix;
  }

  private async initiateAuth(flow: AuthFlowType, parameters: AuthParametersType): Promise<InitiateAuthResponse> {
    return await this.cognito
      .initiateAuth({
        ClientId: this.clientId,
        AuthFlow: flow,
        AuthParameters: parameters,
      })
      .promise();
  }

  public async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const authResponse = await this.initiateAuth("USER_PASSWORD_AUTH", {
        USERNAME: loginData.email,
        PASSWORD: loginData.password,
      });

      return this.getDataFromInitiateAuth(authResponse);
    } catch (e) {
      if (
        e.code === "InvalidParameterException" ||
        e.code === "UserNotFoundException" ||
        e.code === "NotAuthorizedException"
      ) {
        console.log(`Error: ${e.code}`, e);
        throw new InvalidLoginData("Você inseriu um endereço de e-mail e/ou senha incorreta.");
      } else {
        throw e;
      }
    }
  }
  public async logout(accessToken: string): Promise<void> {
    try {
      await this.cognito
        .globalSignOut({
          AccessToken: accessToken,
        })
        .promise();
    } catch (e) {
      if (e.code === "InvalidParameterException" || e.code === "NotAuthorizedException") {
        throw new AccessTokenException("Não foi possivel verificar a assinatura do access token.");
      } else {
        throw e;
      }
    }
  }

  public async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const authResponse = await this.initiateAuth("REFRESH_TOKEN_AUTH", {
        REFRESH_TOKEN: refreshToken,
      });

      return this.getDataFromInitiateAuth(authResponse);
    } catch (e) {
      if (e.code === "NotAuthorizedException" || e.code === "InvalidParameterException") {
        throw new InvalidParameterException("O valor refreshToken é invalido.");
      } else {
        throw e;
      }
    }
  }

  private async respondAuthChallenge(
    ChallengeName: ChallengeNameType,
    session: string,
    firstPasswordData: FirstPasswordRequest
  ): Promise<RespondToAuthChallengeResponse> {
    return await this.cognito
      .respondToAuthChallenge({
        ChallengeName: ChallengeName,
        ClientId: this.clientId,
        Session: session,
        ChallengeResponses: {
          NEW_PASSWORD: firstPasswordData.password,
          USERNAME: firstPasswordData.email,
        },
      })
      .promise();
  }

  public async firstPassword(firstPasswordData: FirstPasswordRequest): Promise<AuthResponse> {
    try {
      const initAuth = await this.initiateAuth("USER_PASSWORD_AUTH", {
        USERNAME: firstPasswordData.email,
        PASSWORD: firstPasswordData.confirmationCode,
      });

      if (initAuth.ChallengeName !== "NEW_PASSWORD_REQUIRED") {
        throw new ChangePasswordException("Internal server error.");
      }

      const authResponse = await this.respondAuthChallenge(
        "NEW_PASSWORD_REQUIRED",
        initAuth.Session,
        firstPasswordData
      );

      return this.getDataFromInitiateAuth(authResponse);
    } catch (e) {
      console.log(e);
      if (e.code === "UserNotFoundException") {
        throw new InvalidLoginData("Você inseriu um endereço de e-mail e/ou senha incorreta.");
      } else if (e.code === "NotAuthorizedException") {
        throw new ChangePasswordException("É necessário cadastrar uma nova senha para este usuário.");
      } else {
        throw e;
      }
    }
  }

  public async createUser(user: User): Promise<User> {
    if (this.ignorePrefix.length && user.email.startsWith(this.ignorePrefix)) {
      return Promise.resolve(user);
    }

    return await new Promise((resolve, reject) => {
      this.cognito.adminCreateUser(
        {
          UserPoolId: this.userPoolId,
          Username: user.email,
          UserAttributes: [
            { Name: "custom:id", Value: user.id.toString() },
            { Name: "email", Value: user.email },
            { Name: "email_verified", Value: "true" },
          ],
        },
        (error) => {
          if (error) {
            return reject(error);
          }
          resolve(user);
        }
      );
    });
  }

  public async updateUser(user: User): Promise<User> {
    return await new Promise((resolve, reject) => {
      this.cognito.adminUpdateUserAttributes(
        {
          UserPoolId: this.userPoolId,
          Username: user.email,
          UserAttributes: [{ Name: "custom:name", Value: user.name }],
        },
        (error) => {
          if (error) {
            return reject(error);
          }

          resolve(user);
        }
      );
    });
  }

  public async getCognitoUser(user: User): Promise<AdminGetUserResponse> {
    return new Promise((resolve, reject) => {
      this.cognito.adminGetUser(
        {
          UserPoolId: this.userPoolId,
          Username: user.email,
        },
        (err, response) => {
          if (err) {
            return reject(err);
          }

          resolve(response);
        }
      );
    });
  }

  public async blockUser(user: User): Promise<User> {
    const cognitoUser = await this.getCognitoUser(user);
    return new Promise((resolve, reject) => {
      this.cognito.adminDisableUser(
        {
          UserPoolId: this.userPoolId,
          Username: cognitoUser.Username,
        },
        (err) => {
          if (err) {
            return reject(err);
          }

          resolve(user);
        }
      );
    });
  }

  public async unblockUser(user: User): Promise<User> {
    const cognitoUser = await this.getCognitoUser(user);
    return new Promise((resolve, reject) => {
      this.cognito.adminEnableUser(
        {
          UserPoolId: this.userPoolId,
          Username: cognitoUser.Username,
        },
        (err) => {
          if (err) {
            return reject(err);
          }

          resolve(user);
        }
      );
    });
  }

  public async forgotPassword(user: User): Promise<User> {
    try {
      await this.cognito
        .forgotPassword({
          ClientId: this.clientId,
          Username: user.email,
        })
        .promise();

      return user;
    } catch (error) {
      if (error.code === "NotAuthorizedException") {
        throw new CognitoException(
          "Impossível redefinir a senha para este usuário. Entre em contato com o administrador do sistema."
        );
      } else if (error.code === "LimitExceededException") {
        throw new CognitoException("Muitas tentativas feitas para este usuário. Tente novamente mais tarde.");
      } else {
        throw error;
      }
    }
  }

  private getDataFromInitiateAuth(authResponse: InitiateAuthResponse): Promise<AuthResponse> {
    const accessToken: string = authResponse.AuthenticationResult.AccessToken;
    const refreshToken: string = authResponse.AuthenticationResult.RefreshToken;
    const expiresIn: number = authResponse.AuthenticationResult.ExpiresIn;
    const idToken: string = authResponse.AuthenticationResult.IdToken;

    return Object.assign({
      accessToken,
      refreshToken,
      expiresIn,
      idToken,
    });
  }
}
