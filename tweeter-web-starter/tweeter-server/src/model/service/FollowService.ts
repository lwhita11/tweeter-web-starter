import { AuthToken, User, FakeData, Status, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { UserService } from "./UserService";

export class FollowService implements Service {
  private userService;

  constructor() {
    this.userService = new UserService();
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.userService.getFollowerCount(
      token,
      userToFollow
    );
    const followeeCount = await this.userService.getFolloweeCount(
      token,
      userToFollow
    );

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.userService.getFollowerCount(
      token,
      userToUnfollow
    );
    const followeeCount = await this.userService.getFolloweeCount(
      token,
      userToUnfollow
    );

    return [followerCount, followeeCount];
  }
}
