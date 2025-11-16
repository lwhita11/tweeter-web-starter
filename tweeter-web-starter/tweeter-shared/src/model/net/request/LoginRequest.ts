import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface LoginRequest extends TweeterRequest {
  readonly alias: string;
  readonly password: string;
}
