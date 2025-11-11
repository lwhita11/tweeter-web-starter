import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { url } from "inspector";
import { PostStatusPresenter } from "../../../../src/presenter/PostStatusPresenter";
import { useUserInfo } from "../../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, Status, User } from "tweeter-shared";
import {
  anyOfClass,
  deepEqual,
  instance,
  mock,
  verify,
} from "@typestrong/ts-mockito";

library.add(fab);

jest.mock("../../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Login Component", () => {
  const mockUserInstance = new User("First", "Last", "@handle", "imageUrl");
  const mockAuthTokenInstance = new AuthToken("token123", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });
  it("starts with the post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables post status and clear buttons if field has text", async () => {
    const { user, postStatusButton, clearButton, postField } =
      renderPostStatusAndGetElement();

    await user.type(postField, "a");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables buttons if text field is cleared", async () => {
    const { user, postStatusButton, clearButton, postField } =
      renderPostStatusAndGetElement();
    await user.type(postField, "a");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();

    await user.type(postField, "a");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("calls the presenters postStatus method with correct parameters when Post Status in button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://somewhere.com";
    const post = "myPost";
    const thisUser = mockUserInstance;
    const status = new Status(post, thisUser, mockAuthTokenInstance.timestamp);

    const { postStatusButton, clearButton, postField, user } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    await user.type(postField, post);
    await user.click(postStatusButton);

    verify(
      mockPresenter.submitStatus(anyOfClass(AuthToken), anyOfClass(Status))
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post status/i });
  const clearButton = screen.getByRole("button", { name: /clear/i });
  const postField = screen.getByRole("textbox", { name: /postField/i });

  return { user, postStatusButton, clearButton, postField };
}
