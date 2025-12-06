import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../dao/DaoFactory";
import { StatusDao } from "../dao/StatusDao";
import { FollowDao } from "../dao/FollowDao";
import { UserDao } from "../dao/UserDao";

export class StatusService implements Service {
  private factory: DaoFactory;
  private statusDao: StatusDao;
  private followDao: FollowDao;
  private userDao: UserDao;

  constructor(factory: DaoFactory) {
    this.factory = factory;
    this.statusDao = factory.getStatusDao();
    this.followDao = factory.getFollowDao();
    this.userDao = factory.getUserDao();
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.statusDao.getStoryItems(userAlias, pageSize, lastItem);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.statusDao.getFeedItems(userAlias, pageSize, lastItem);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const authDao = this.factory.getAuthDao();
    const userAlias = await authDao.getAliasFromToken(token);
    if (!userAlias) {
      return;
    }
    const postRes = await this.statusDao.postStatus(userAlias, newStatus);
    let hasMore = false;
    let lastItem = null;

    do {
      const [aliasList, hasMore] = await this.followDao.getFollowers(
        userAlias,
        200,
        lastItem
      );
      const aliases = aliasList.map((a) => a.follower_alias);
      lastItem = await this.userDao.getUser(aliases[aliases.length - 1]);

      for (const followerAlias of aliases) {
        await this.statusDao.insertFeedItem(
          followerAlias,
          userAlias,
          newStatus
        );
      }
    } while (hasMore);
  }
}
