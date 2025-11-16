import { AuthRequest } from "./AuthRequest";

export interface GetUserRequest extends AuthRequest {
  readonly alias: string;
}
