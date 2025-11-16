import { UserDto } from "../../dto/UserDto";
import { AuthRequest } from "./AuthRequest";

export interface IsFollowerRequest extends AuthRequest {
  readonly user: UserDto;
  readonly selectedUser: UserDto;
}
