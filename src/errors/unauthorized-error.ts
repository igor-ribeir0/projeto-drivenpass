import { ApplicationError } from "../protocols";

export function unauthorizedError(): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: 'You are unauthorized to continue. You must be signed!',
  };
}