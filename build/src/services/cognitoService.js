"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoService = void 0;
const aws_sdk_1 = require("aws-sdk");
const typedi_1 = require("typedi");
const authErrors_1 = require("../errors/authErrors");
let CognitoService = class CognitoService {
    constructor(cognito, userPoolId, clientId, ignorePrefix) {
        this.cognito = cognito;
        this.userPoolId = userPoolId;
        this.clientId = clientId;
        this.ignorePrefix = ignorePrefix;
    }
    initiateAuth(flow, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cognito
                .initiateAuth({
                ClientId: this.clientId,
                AuthFlow: flow,
                AuthParameters: parameters,
            })
                .promise();
        });
    }
    login(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authResponse = yield this.initiateAuth("USER_PASSWORD_AUTH", {
                    USERNAME: loginData.email,
                    PASSWORD: loginData.password,
                });
                return this.getDataFromInitiateAuth(authResponse);
            }
            catch (e) {
                if (e.code === "InvalidParameterException" ||
                    e.code === "UserNotFoundException" ||
                    e.code === "NotAuthorizedException") {
                    console.log(`Error: ${e.code}`, e);
                    throw new authErrors_1.InvalidLoginData("Você inseriu um endereço de e-mail e/ou senha incorreta.");
                }
                else {
                    throw e;
                }
            }
        });
    }
    logout(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.cognito
                    .globalSignOut({
                    AccessToken: accessToken,
                })
                    .promise();
            }
            catch (e) {
                if (e.code === "InvalidParameterException" || e.code === "NotAuthorizedException") {
                    throw new authErrors_1.AccessTokenException("Não foi possivel verificar a assinatura do access token.");
                }
                else {
                    throw e;
                }
            }
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authResponse = yield this.initiateAuth("REFRESH_TOKEN_AUTH", {
                    REFRESH_TOKEN: refreshToken,
                });
                return this.getDataFromInitiateAuth(authResponse);
            }
            catch (e) {
                if (e.code === "NotAuthorizedException" || e.code === "InvalidParameterException") {
                    throw new authErrors_1.InvalidParameterException("O valor refreshToken é invalido.");
                }
                else {
                    throw e;
                }
            }
        });
    }
    respondAuthChallenge(ChallengeName, session, firstPasswordData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cognito
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
        });
    }
    firstPassword(firstPasswordData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const initAuth = yield this.initiateAuth("USER_PASSWORD_AUTH", {
                    USERNAME: firstPasswordData.email,
                    PASSWORD: firstPasswordData.confirmationCode,
                });
                if (initAuth.ChallengeName !== "NEW_PASSWORD_REQUIRED") {
                    throw new authErrors_1.ChangePasswordException("Internal server error.");
                }
                const authResponse = yield this.respondAuthChallenge("NEW_PASSWORD_REQUIRED", initAuth.Session, firstPasswordData);
                return this.getDataFromInitiateAuth(authResponse);
            }
            catch (e) {
                console.log(e);
                if (e.code === "UserNotFoundException") {
                    throw new authErrors_1.InvalidLoginData("Você inseriu um endereço de e-mail e/ou senha incorreta.");
                }
                else if (e.code === "NotAuthorizedException") {
                    throw new authErrors_1.ChangePasswordException("É necessário cadastrar uma nova senha para este usuário.");
                }
                else {
                    throw e;
                }
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ignorePrefix.length && user.email.startsWith(this.ignorePrefix)) {
                return Promise.resolve(user);
            }
            return yield new Promise((resolve, reject) => {
                this.cognito.adminCreateUser({
                    UserPoolId: this.userPoolId,
                    Username: user.email,
                    UserAttributes: [
                        { Name: "custom:id", Value: user.id.toString() },
                        { Name: "email", Value: user.email },
                        { Name: "email_verified", Value: "true" },
                    ],
                }, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(user);
                });
            });
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.cognito.adminUpdateUserAttributes({
                    UserPoolId: this.userPoolId,
                    Username: user.email,
                    UserAttributes: [{ Name: "custom:name", Value: user.name }],
                }, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(user);
                });
            });
        });
    }
    getCognitoUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.cognito.adminGetUser({
                    UserPoolId: this.userPoolId,
                    Username: user.email,
                }, (err, response) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(response);
                });
            });
        });
    }
    blockUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const cognitoUser = yield this.getCognitoUser(user);
            return new Promise((resolve, reject) => {
                this.cognito.adminDisableUser({
                    UserPoolId: this.userPoolId,
                    Username: cognitoUser.Username,
                }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(user);
                });
            });
        });
    }
    unblockUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const cognitoUser = yield this.getCognitoUser(user);
            return new Promise((resolve, reject) => {
                this.cognito.adminEnableUser({
                    UserPoolId: this.userPoolId,
                    Username: cognitoUser.Username,
                }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(user);
                });
            });
        });
    }
    forgotPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.cognito
                    .forgotPassword({
                    ClientId: this.clientId,
                    Username: user.email,
                })
                    .promise();
                return user;
            }
            catch (error) {
                if (error.code === "NotAuthorizedException") {
                    throw new authErrors_1.CognitoException("Impossível redefinir a senha para este usuário. Entre em contato com o administrador do sistema.");
                }
                else if (error.code === "LimitExceededException") {
                    throw new authErrors_1.CognitoException("Muitas tentativas feitas para este usuário. Tente novamente mais tarde.");
                }
                else {
                    throw error;
                }
            }
        });
    }
    getDataFromInitiateAuth(authResponse) {
        console.log(authResponse);
        const accessToken = authResponse.AuthenticationResult.AccessToken;
        const refreshToken = authResponse.AuthenticationResult.RefreshToken;
        const expiresIn = authResponse.AuthenticationResult.ExpiresIn;
        const idToken = authResponse.AuthenticationResult.IdToken;
        return Object.assign({
            accessToken,
            refreshToken,
            expiresIn,
            idToken,
        });
    }
};
CognitoService = __decorate([
    typedi_1.Service("authenticationProvider"),
    __param(0, typedi_1.Inject("cognitoSDK")),
    __param(1, typedi_1.Inject("userPoolId")),
    __param(2, typedi_1.Inject("clientId")),
    __param(3, typedi_1.Inject("ignorePrefix")),
    __metadata("design:paramtypes", [aws_sdk_1.CognitoIdentityServiceProvider, String, String, String])
], CognitoService);
exports.CognitoService = CognitoService;
//# sourceMappingURL=cognitoService.js.map