import { Buffer } from "buffer";
import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias)!.dto;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    // TODO: Replace with the result of calling the server
    return this.getFakeData();
  }

  private async getFakeData(): Promise<[UserDto, string]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    const userDto: UserDto = user.dto;

    return [userDto, FakeData.instance.authToken.token];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageBuffer = Buffer.from(userImageBytes, "base64");

    return this.getFakeData();
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async logout(authToken: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
