import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Alias } from "vite";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  navigateToFeed(user: User, authToken: AuthToken, rememberMe: boolean): void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private userService: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.userService = new UserService();
  }

  public async login(alias: string, password: string, rememberMe: boolean) {
    this.doFailureReportingOperation(async () => {
      this.doAuthenticationOperation(
        async () => {
          return this.userService.login(alias, password);
        },
        this.view,
        rememberMe
      );
    }, "to log user in");
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    this.doFailureReportingOperation(async () => {
      this.doAuthenticationOperation(
        async () => {
          return this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            userImageBytes,
            imageFileExtension
          );
        },
        this.view,
        rememberMe
      );
    }, "register user");
  }
}
