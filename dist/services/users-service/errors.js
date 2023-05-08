"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidEmailPasswordError = exports.duplicatedEmailError = void 0;
function duplicatedEmailError() {
    return {
        name: "DuplicatedEmailError",
        message: "There is already an user with given email"
    };
}
exports.duplicatedEmailError = duplicatedEmailError;
;
function invalidEmailPasswordError() {
    return {
        name: "InvalidEmailPasswordError",
        message: "Invalid email or password"
    };
}
exports.invalidEmailPasswordError = invalidEmailPasswordError;
;
