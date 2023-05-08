import { ApplicationError } from "../protocols";

export function DuplicatedTitleError(): ApplicationError {
  return {
    name: "DuplicatedTitleError",
    message: "There is already an credential with given title"
  };
};