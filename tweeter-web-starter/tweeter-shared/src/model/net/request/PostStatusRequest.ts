import { StatusDto } from "../../dto/StatusDto";
import { AuthRequest } from "./AuthRequest";

export interface PostStatusRequest extends AuthRequest {
  readonly status: StatusDto;
}
