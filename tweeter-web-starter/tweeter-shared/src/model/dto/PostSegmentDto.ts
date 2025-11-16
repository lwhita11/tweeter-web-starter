import { Type } from "../domain/PostSegment";
import { UserDto } from "./UserDto";

export interface PostSegmentDto {
  readonly text: string;
  readonly startPostion: number;
  readonly endPosition: number;
  readonly type: Type;
}
