"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenException = exports.ChangePasswordException = exports.InvalidLoginData = exports.NotAuthorizedException = exports.InvalidParameterException = exports.MissingRequiredParameter = exports.ResourceNotFoundException = exports.InvalidParameterError = exports.WrongBlockReasonError = exports.NonRepresentativeUserCannotSign = exports.UserNotPermittedError = exports.UserGroupNotFoundError = exports.CognitoException = exports.ForgotPasswordDadosInvalidoError = exports.UserIsAlreadyUnblockedError = exports.UserIsAlreadyBlockedError = exports.UserNotFoundError = exports.UserExistsError = void 0;
class UserExistsError extends Error {
}
exports.UserExistsError = UserExistsError;
class UserNotFoundError extends Error {
}
exports.UserNotFoundError = UserNotFoundError;
class UserIsAlreadyBlockedError extends Error {
}
exports.UserIsAlreadyBlockedError = UserIsAlreadyBlockedError;
class UserIsAlreadyUnblockedError extends Error {
}
exports.UserIsAlreadyUnblockedError = UserIsAlreadyUnblockedError;
class ForgotPasswordDadosInvalidoError extends Error {
}
exports.ForgotPasswordDadosInvalidoError = ForgotPasswordDadosInvalidoError;
class CognitoException extends Error {
}
exports.CognitoException = CognitoException;
class UserGroupNotFoundError extends Error {
}
exports.UserGroupNotFoundError = UserGroupNotFoundError;
class UserNotPermittedError extends Error {
}
exports.UserNotPermittedError = UserNotPermittedError;
class NonRepresentativeUserCannotSign extends Error {
}
exports.NonRepresentativeUserCannotSign = NonRepresentativeUserCannotSign;
class WrongBlockReasonError extends Error {
}
exports.WrongBlockReasonError = WrongBlockReasonError;
class InvalidParameterError extends Error {
}
exports.InvalidParameterError = InvalidParameterError;
class ResourceNotFoundException extends Error {
}
exports.ResourceNotFoundException = ResourceNotFoundException;
class MissingRequiredParameter extends Error {
}
exports.MissingRequiredParameter = MissingRequiredParameter;
class InvalidParameterException extends Error {
}
exports.InvalidParameterException = InvalidParameterException;
class NotAuthorizedException extends Error {
}
exports.NotAuthorizedException = NotAuthorizedException;
class InvalidLoginData extends Error {
}
exports.InvalidLoginData = InvalidLoginData;
class ChangePasswordException extends Error {
}
exports.ChangePasswordException = ChangePasswordException;
class AccessTokenException extends Error {
}
exports.AccessTokenException = AccessTokenException;
//# sourceMappingURL=authErrors.js.map