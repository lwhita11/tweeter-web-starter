import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(token, pageSize, userAlias, lastItem);
  }

  private async getFakeData(
    token: string,
    pageSize: number,
    userAlias: string,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    console.log("Status.fromDto:", Status.fromDto);
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(token, pageSize, userAlias, lastItem);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
