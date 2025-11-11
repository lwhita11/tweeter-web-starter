import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading(value: boolean): void;
  clearPostInput(): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._service = new StatusService();
  }

  public get service() {
    return this._service;
  }

  public async submitStatus(authToken: AuthToken, status: Status) {
    let toastId = "";

    await this.doFailureReportingWithFinally(
      async () => {
        this.view.setIsLoading(true);
        toastId = this.view.displayInfoMessage("Posting status...", 0);

        await this.service.postStatus(authToken, status);

        this.view.clearPostInput();
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post status",
      async () => {
        this.view.deleteMessage(toastId);
        this.view.setIsLoading(false);
      }
    );
  }
}
