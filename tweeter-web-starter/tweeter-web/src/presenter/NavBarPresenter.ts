import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

export interface NavBarView extends MessageView {
  clearUserInfo(): void;
  navigateTo(path: string): void;
}

export class NavBarPresenter extends Presenter<NavBarView> {
  _service: UserService;

  public constructor(view: NavBarView) {
    super(view);
    this._service = new UserService();
  }

  public get service() {
    return this._service;
  }

  public async logOut(authToken: AuthToken) {
    const toastId = this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      // Replace with real server call
      await this.service.logout(authToken);

      this.view.deleteMessage(toastId);
      this.view.clearUserInfo();
      this.view.navigateTo("/login");
    }, "log user out");
  }
}
