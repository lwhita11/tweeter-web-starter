import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import { AuthToken, User } from "tweeter-shared";
import { useRef } from "react";
import {
  NavigationPresenter,
  NavigationView,
} from "../../presenter/NavigationPresenter";

export const useUserNavigation = () => {
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();

  const navigateToUser = async (
    event: React.MouseEvent,
    featurePath: string
  ) => {
    event.preventDefault();
    const alias = extractAlias(event.target.toString());
    await presenterRef.current!.navigateToUser(authToken!, alias, featurePath);
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const view: NavigationView = {
    displayErrorMessage,
    navigateTo: navigate,
    setDisplayedUser,
  };

  const presenterRef = useRef<NavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new NavigationPresenter(view);
  }

  return { navigateToUser };
};
