import { UserDto } from "../../dto/UserDto";
import { AuthRequest } from "./AuthRequest";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends AuthRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: UserDto | null;
}
