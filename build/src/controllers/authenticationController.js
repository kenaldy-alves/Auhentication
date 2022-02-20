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
exports.AuthenticationController = void 0;
const authErrors_1 = require("../errors/authErrors");
const typedi_1 = require("typedi");
const authenticationService_1 = require("../services/authenticationService");
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const credentials = yield this.authenticationService.login(email, password);
                res.status(200).json(credentials);
            }
            catch (error) {
                if (error instanceof authErrors_1.InvalidLoginData) {
                    res.status(422).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: error.message });
                }
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = req.body;
                yield this.authenticationService.logout(accessToken);
                res.sendStatus(204);
            }
            catch (error) {
                if (error instanceof authErrors_1.AccessTokenException) {
                    res.status(422).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: error.message });
                }
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const credentials = yield this.authenticationService.refreshToken(refreshToken);
                res.status(200).json(credentials);
            }
            catch (error) {
                if (error instanceof authErrors_1.InvalidParameterException) {
                    res.status(422).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: error.message });
                }
            }
        });
    }
    firstPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, confirmationCode } = req.body;
                const credentials = yield this.authenticationService.firstPassword(email, password, confirmationCode);
                res.status(200).json(credentials);
            }
            catch (error) {
                if (error instanceof authErrors_1.InvalidLoginData || error instanceof authErrors_1.ChangePasswordException) {
                    res.status(422).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: error.message });
                }
            }
        });
    }
};
AuthenticationController = __decorate([
    typedi_1.Service("authenticationController"),
    __param(0, typedi_1.Inject("authenticationService")),
    __metadata("design:paramtypes", [authenticationService_1.AuthenticationService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authenticationController.js.map