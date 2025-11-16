import {
  AuthToken,
  User,
  FakeData,
  Status,
  PagedUserItemRequest,
  FollowActionRequest,
} from "tweeter-shared";
import { UserService } from "./UserService";
import { Service } from "./Service";
import { ServerFacade } from "../model.network/ServerFacade";

export class FollowService implements Service {
  private userService;
  private serverFacade;

  constructor() {
    this.userService = new UserService();
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
      token: authToken.token,
    };
    return this.serverFacade.getMoreFollowees(request);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
      token: authToken.token,
    };
    return this.serverFacade.getMoreFollowers(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowActionRequest = {
      user: userToFollow,
      token: authToken.token,
    };

    return this.serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowActionRequest = {
      user: userToUnfollow,
      token: authToken.token,
    };

    return this.serverFacade.follow(request);
  }
}
