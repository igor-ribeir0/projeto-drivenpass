"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorizedError = void 0;
function unauthorizedError() {
    return {
        name: 'UnauthorizedError',
        message: 'You are unauthorized to continue. You must be signed!',
    };
}
exports.unauthorizedError = unauthorizedError;
