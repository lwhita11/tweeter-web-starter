import { AuthToken } from "tweeter-shared";
import {
  NavBarPresenter,
  NavBarView,
} from "../../../src/presenter/NavBarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../../src/model.service/UserService";

describe("NavBarPresenter", () => {
  let mockNavBarPresenterView: NavBarView;
  let navBarPresenter: NavBarPresenter;
  let mockService: UserService;

  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockNavBarPresenterView = mock<NavBarView>();
    const mockNavBarPresetnerViewInstance = instance(mockNavBarPresenterView);
    when(mockNavBarPresenterView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123"
    );

    const navBarPresenterSpy = spy(
      new NavBarPresenter(mockNavBarPresetnerViewInstance)
    );
    navBarPresenter = instance(navBarPresenterSpy);

    mockService = mock<UserService>();
    const mockServiceInstance = instance(mockService);

    when(navBarPresenterSpy.service).thenReturn(instance(mockService));
  });
  it("tells the view to display a loging out message", () => {
    navBarPresenter.logOut(authToken);
    verify(
      mockNavBarPresenterView.displayInfoMessage("Logging Out...", 0)
    ).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await navBarPresenter.logOut(authToken);
    verify(mockService.logout(authToken)).once();

    // let [capturedAuthToken] = capture(mockService.logout).last();
    // expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page when successful", async () => {
    await navBarPresenter.logOut(authToken);

    verify(mockNavBarPresenterView.deleteMessage("messageId123")).once();
    verify(mockNavBarPresenterView.clearUserInfo()).once();
    verify(mockNavBarPresenterView.navigateTo("/login")).once();
    verify(
      mockNavBarPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: Error: An error occurred`
      )
    ).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unsuccessful", async () => {
    let error = new Error("An error occurred");
    when(mockService.logout(anything())).thenThrow(error);

    await navBarPresenter.logOut(authToken);

    let [errorString] = capture(
      mockNavBarPresenterView.displayErrorMessage
    ).last();
    console.log(errorString);

    verify(
      mockNavBarPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: Error: An error occurred`
      )
    ).once();
    verify(mockNavBarPresenterView.deleteMessage(anything())).never();
    verify(mockNavBarPresenterView.clearUserInfo()).never();
    verify(mockNavBarPresenterView.navigateTo("/login")).never();
  });
});
