import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface RegisterResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly authToken: string;
}
