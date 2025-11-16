import { StatusDto } from "../../dto/StatusDto";
import { AuthRequest } from "./AuthRequest";

export interface PagedStatusItemRequest extends AuthRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: StatusDto | null;
}
