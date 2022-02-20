"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError {
    constructor(message, statusCode = 500) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=apiErrors.js.map