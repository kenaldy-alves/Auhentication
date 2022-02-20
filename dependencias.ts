import { Container } from "typedi";

import AWS, { CognitoIdentityServiceProvider} from "aws-sdk";

//Controllers
import "./src/controllers/authenticationController";

//Services
import "./src/services/cognitoService";

// Middlewares
import { id } from "cls-rtracer";

const fetchWithTraceId = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  const _init: RequestInit = init || {};
  _init.headers = Object.assign(_init.headers, { "X-Request-Id": id() });
  return fetch(input, _init);
};

// AWS
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

Container.set("cognitoSDK", new CognitoIdentityServiceProvider());
Container.set("userPoolId", process.env.USER_POOL_ID);
Container.set("clientId", process.env.CLIENT_ID);
Container.set("clientSecret", process.env.SECRET_ACCESS_KEY);
Container.set("ignorePrefix", process.env.ENVIRONMENT === "qa" ? "automacao-" : "");
