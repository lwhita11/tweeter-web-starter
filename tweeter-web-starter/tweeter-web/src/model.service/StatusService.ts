import {
  AuthToken,
  Status,
  FakeData,
  PagedStatusItemRequest,
  PostStatusRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../model.network/ServerFacade";

export class StatusService implements Service {
  private serverFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
      token: authToken.token,
    };
    return this.serverFacade.getMoreStoryItems(request);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
      token: authToken.token,
    };
    return this.serverFacade.getMoreFeedItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request: PostStatusRequest = {
      status: newStatus,
      token: authToken.token,
    };
    await this.serverFacade.postStatus(request);
  }
}
