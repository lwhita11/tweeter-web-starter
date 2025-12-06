import { UserDto } from "tweeter-shared";

export interface FollowDao {
  getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[{ followee_alias: string; follower_alias: string }[], boolean]>;

  getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[{ followee_alias: string; follower_alias: string }[], boolean]>;

  follow(userAlias: string, userAliasToFollow: string): Promise<void>;
  unfollow(userAlias: string, userAliasToUnfollow: string): Promise<void>;
  isFollower(userAlias: string, otherUserAlias: string): Promise<boolean>;
  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;
}
