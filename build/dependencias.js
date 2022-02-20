"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
//import { getManager } from "typeorm";
const aws_sdk_1 = __importStar(require("aws-sdk"));
//Controllers
require("./src/controllers/authenticationController");
//Services
require("./src/services/cognitoService");
// Middlewares
const cls_rtracer_1 = require("cls-rtracer");
const fetchWithTraceId = (input, init) => {
    const _init = init || {};
    _init.headers = Object.assign(_init.headers, { "X-Request-Id": cls_rtracer_1.id() });
    return fetch(input, _init);
};
// Repositories
//Container.set("entityManager", getManager());
// AWS
aws_sdk_1.default.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});
typedi_1.Container.set("cognitoSDK", new aws_sdk_1.CognitoIdentityServiceProvider());
typedi_1.Container.set("userPoolId", process.env.USER_POOL_ID);
typedi_1.Container.set("clientId", process.env.CLIENT_ID);
typedi_1.Container.set("clientSecret", process.env.SECRET_ACCESS_KEY);
typedi_1.Container.set("ignorePrefix", process.env.ENVIRONMENT === "qa" ? "automacao-" : "");
//# sourceMappingURL=dependencias.js.map