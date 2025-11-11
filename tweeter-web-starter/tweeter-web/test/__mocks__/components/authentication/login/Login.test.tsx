import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import Login from "../../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { url } from "inspector";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signIn } = renderLoginAndGetElement("/");
    expect(signIn).toBeDisabled();
  });

  it("enables sign in button if both alias and password fields have text", async () => {
    const { signIn, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signIn).toBeEnabled();
  });

  it("disables sign in button if either alias or password field is cleared", async () => {
    const { signIn, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signIn).toBeEnabled();

    await user.clear(aliasField);
    expect(signIn).toBeDisabled();

    await user.type(aliasField, "a");
    expect(signIn).toBeEnabled();

    await user.clear(passwordField);
    expect(signIn).toBeDisabled();
  });

  it("calls the presenters login method with correct parameters when sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://somewhere.com";
    const alias = "@alias";
    const password = "myPassword";

    const { signIn, aliasField, passwordField, user } =
      renderLoginAndGetElement("/", mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signIn);

    verify(mockPresenter.login(alias, password, false)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signIn = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signIn, aliasField, passwordField };
}
