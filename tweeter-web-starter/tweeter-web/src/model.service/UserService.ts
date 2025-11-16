import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  FakeData,
  GetUserRequest,
  LoginRequest,
  RegisterRequest,
  IsFollowerRequest,
  FollowActionRequest,
  LogoutRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../model.network/ServerFacade";

export class UserService implements Service {
  private serverFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: GetUserRequest = {
      alias: alias,
      token: authToken.token,
    };
    console.log("userAlias: ", alias);
    return this.serverFacade.getUser(request);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias: alias,
      password: password,
    };

    console.log("logging in with alias: ", alias);

    const res = await this.serverFacade.login(request);
    console.log("login res: ", res);
    return res;
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const base64String = Buffer.from(userImageBytes).toString("base64");
    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: base64String,
      imageFileExtension: imageFileExtension,
    };
    return this.serverFacade.register(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: IsFollowerRequest = {
      user: user,
      selectedUser: selectedUser,
      token: authToken.token,
    };
    return this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowActionRequest = {
      user: user,
      token: authToken.token,
    };
    return this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowActionRequest = {
      user: user,
      token: authToken.token,
    };
    return this.serverFacade.getFollowerCount(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
    };
    this.serverFacade.logout(request);
  }
}
