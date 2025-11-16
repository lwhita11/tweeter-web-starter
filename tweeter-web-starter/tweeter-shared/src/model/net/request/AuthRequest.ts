import { TweeterRequest } from "./TweeterRequest";

export interface AuthRequest extends TweeterRequest {
  readonly token: string;
}
