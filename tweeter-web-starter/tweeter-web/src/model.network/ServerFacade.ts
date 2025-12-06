import {
  AuthToken,
  FollowActionRequest,
  FollowActionResponse,
  FollowCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://qby3fbrp85.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFolloweeCount(request: FollowActionRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowCountResponse
    >(request, "/count/followee");

    // Handle errors
    if (response.success) {
      if (response.count == null) {
        throw new Error(`No count found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFollowerCount(request: FollowActionRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowCountResponse
    >(request, "/count/follower");

    // Handle errors
    if (response.success) {
      if (response.count == null) {
        throw new Error(`No count found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async follow(
    request: FollowActionRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow");

    // Handle errors
    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower");

    // Handle errors
    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async unfollow(
    request: FollowActionRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/unfollow");

    // Handle errors
    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed/list");

    const items: Status[] | null =
      response.success && response.statuses
        ? response.statuses.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No Feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story/list");

    const items: Status[] | null =
      response.success && response.statuses
        ? response.statuses.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/status/post");

    // Handle errors
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user");

    const user: User | null = User.fromDto(response.user);

    // Handle errors
    if (response.success) {
      return user;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    try {
      const response = await this.clientCommunicator.doPost<
        LoginRequest,
        LoginResponse
      >(request, "/user/login");

      const user = User.fromDto(response.user);
      const authToken = new AuthToken(response.authToken, Date.now()); // CHANGE THIS WHEN IMPLEMENTING DB . Pass timestamp with any authToken response
      if (!response.success) {
        throw new Error();
      }
      // Handle errors
      if (response.success) {
        if (user == null) {
          throw new Error(`No user found`);
        }
        return [user, authToken];
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    } catch (error: any) {
      throw new Error("Incorrect Username or Password");
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/user/logout");

    // Handle errors
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    try {
      const response = await this.clientCommunicator.doPost<
        RegisterRequest,
        RegisterResponse
      >(request, "/user/register");

      const user = User.fromDto(response.user);
      const authToken = new AuthToken(response.authToken, Date.now());

      if (!response.success) {
        throw new Error(response.message ?? "Registration failed");
      }
      // Handle errors
      if (response.success) {
        if (user == null) {
          throw new Error(`No user found`);
        }
        return [user, authToken];
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    } catch (error: any) {
      const msg = "Alias is taken";

      throw new Error(msg);
    }
  }
}
