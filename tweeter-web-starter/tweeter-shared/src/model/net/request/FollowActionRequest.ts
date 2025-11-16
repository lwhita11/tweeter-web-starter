import { UserDto } from "../../dto/UserDto";
import { AuthRequest } from "./AuthRequest";

export interface FollowActionRequest extends AuthRequest {
  readonly user: UserDto;
}
