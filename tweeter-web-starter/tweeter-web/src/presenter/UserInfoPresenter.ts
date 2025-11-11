import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter, View } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower(value: boolean): void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
  setIsLoading(value: boolean): void;
  navigateTo(path: string): void;
  setDisplayedUser(user: User): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService;
  private followService: FollowService;
  private isFollower;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
    this.followService = new FollowService();
    this.isFollower = false;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser.equals(displayedUser)) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.userService.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser
        );
        this.view.setIsFollower(isFollower);
      }
    }, "determine follower status");
  }

  public async setFolloweeCount(authToken: AuthToken, user: User) {
    this.doFailureReportingOperation(async () => {
      const count = await this.userService.getFolloweeCount(authToken, user);
      this.view.setFolloweeCount(count);
    }, "get followee count");
  }

  public async setFollowerCount(authToken: AuthToken, user: User) {
    this.doFailureReportingOperation(async () => {
      const count = await this.userService.getFollowerCount(authToken, user);
      this.view.setFollowerCount(count);
    }, "get follower count");
  }

  public async changeFollowage(
    authToken: AuthToken,
    user: User,
    status: string,
    setIsFollower: boolean,
    operation: () => Promise<void>
  ) {
    let toastId = this.view.displayInfoMessage(`${status} ${user.name}...`, 0);
    this.view.setIsLoading(true);
    this.doFailureReportingWithFinally(
      async () => {
        await operation();

        const followerCount = await this.userService.getFollowerCount(
          authToken,
          user
        );
        const followeeCount = await this.userService.getFolloweeCount(
          authToken,
          user
        );

        this.view.setIsFollower(setIsFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "follow user",
      async () => {
        this.view.deleteMessage(toastId);
        this.view.setIsLoading(false);
      }
    );
  }

  public async follow(authToken: AuthToken, userToFollow: User) {
    this.changeFollowage(
      authToken,
      userToFollow,
      "Following",
      true,
      async () => {
        await this.followService.follow(authToken, userToFollow);
      }
    );
  }

  public async unfollow(authToken: AuthToken, userToUnfollow: User) {
    this.changeFollowage(
      authToken,
      userToUnfollow,
      "UnFollowing",
      false,
      async () => {
        await this.followService.unfollow(authToken, userToUnfollow);
      }
    );
  }

  public switchToLoggedInUser(currentUser: User) {
    this.view.setDisplayedUser(currentUser);
    this.view.navigateTo(`/${currentUser.alias}`);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return this.userService.getIsFollowerStatus(authToken, user, selectedUser);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.userService.getFolloweeCount(authToken, user);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.userService.getFollowerCount(authToken, user);
  }
}
