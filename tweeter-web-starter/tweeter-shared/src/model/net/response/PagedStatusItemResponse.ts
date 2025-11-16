import { StatusDto } from "../../dto/StatusDto";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedStatusItemResponse extends TweeterResponse {
  statuses: StatusDto[];
  hasMore: boolean;
}
