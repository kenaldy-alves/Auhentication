"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const controller = typedi_1.Container.get("authenticationController");
exports.handler = controller.firstPassword.bind(controller);
//# sourceMappingURL=firstPassword.js.map