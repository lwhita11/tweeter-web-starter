import { StatusDto } from "tweeter-shared";

export interface StatusDao {
  getStoryItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[items: StatusDto[], hasMore: boolean]>;

  getFeedItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[items: StatusDto[], hasMore: boolean]>;

  postStatus(posterAlias: string, status: StatusDto): Promise<void>;

  insertFeedItem(
    followerAlias: string,
    posterAlias: string,
    status: StatusDto
  ): Promise<void>;
}
