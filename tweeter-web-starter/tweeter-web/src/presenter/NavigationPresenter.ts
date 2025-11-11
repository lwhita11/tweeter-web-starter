import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface NavigationView extends View {
  navigateTo(path: string): void;
  setDisplayedUser(user: User): void;
}

export class NavigationPresenter extends Presenter<NavigationView> {
  userService: UserService;

  public constructor(view: NavigationView) {
    super(view);
    this.userService = new UserService();
  }

  public async navigateToUser(
    authToken: AuthToken,
    alias: string,
    featurePath: string
  ) {
    this.doFailureReportingOperation(async () => {
      const toUser = await this.userService.getUser(authToken, alias);
      if (toUser) {
        this.view.setDisplayedUser(toUser);
        this.view.navigateTo(`${featurePath}/${toUser.alias}`);
      }
    }, "get user");
  }
}
