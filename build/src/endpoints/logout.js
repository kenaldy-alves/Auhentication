"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const controller = typedi_1.Container.get("authenticationController");
exports.handler = controller.logout.bind(controller);
//# sourceMappingURL=logout.js.map