import { ApplicationError } from "../../protocols";

export function duplicatedEmailError(): ApplicationError {
  return {
    name: "DuplicatedEmailError",
    message: "There is already an user with given email"
  };
};

export function invalidEmailPasswordError(): ApplicationError {
  return {
    name: "InvalidEmailPasswordError",
    message: "Invalid email or password"
  };
};