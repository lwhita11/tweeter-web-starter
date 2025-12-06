import { AuthToken, User, FakeData, Status, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { UserService } from "./UserService";
import { DaoFactory } from "../dao/DaoFactory";
import { FollowDao } from "../dao/FollowDao";
import { UserDao } from "../dao/UserDao";
import { AuthDao } from "../dao/AuthDao";

export class FollowService implements Service {
  private userService;
  private followDao: FollowDao;
  private userDao: UserDao;
  private authDao: AuthDao;

  constructor(factory: DaoFactory) {
    this.userService = new UserService(factory);
    this.followDao = factory.getFollowDao();
    this.userDao = factory.getUserDao();
    this.authDao = factory.getAuthDao();
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const [aliasList, hasMore] = await this.followDao.getFollowees(
      userAlias,
      pageSize,
      lastItem
    );
    const aliases = aliasList.map((a) => a.followee_alias);
    const users = await this.userDao.batchGetUsers(aliases);
    return [users, hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const [aliasList, hasMore] = await this.followDao.getFollowers(
      userAlias,
      pageSize,
      lastItem
    );
    const aliases = aliasList.map((a) => a.follower_alias);
    const users = await this.userDao.batchGetUsers(aliases);
    return [users, hasMore];
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const userAlias = await this.authDao.getAliasFromToken(token);
    if (userAlias == null) {
      return [0, 0];
    }
    this.followDao.follow(userAlias, userToFollow.alias);
    const followeeCount = await this.followDao.getFolloweeCount(userAlias);
    const followerCount = await this.followDao.getFollowerCount(userAlias);
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const userAlias = await this.authDao.getAliasFromToken(token);
    if (userAlias == null) {
      throw new Error("User not found");
    }
    await this.followDao.unfollow(userAlias, userToUnfollow.alias);
    const followeeCount = await this.followDao.getFolloweeCount(userAlias);
    const followerCount = await this.followDao.getFollowerCount(userAlias);
    return [followerCount, followeeCount];
  }
}
