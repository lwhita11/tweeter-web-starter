import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

interface NavigatorHook {
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
    extractAlias: (value: string) => string;
    getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
}

const useNavigator = (): NavigatorHook => {

    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
    useUserInfo();
  
    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();
  
      try {
        const alias = extractAlias((event.target as HTMLElement).innerText); // Ensure correct value extraction
  
        const user = await getUser(authToken!, alias);
  
        if (!!user) {
          setDisplayedUser(currentUser?.equals(user) ? currentUser! : user);
        }
      } catch (error) {
        displayErrorMessage(`Failed to get user because of exception: ${error}`);
      }
    };
  
    const extractAlias = (value: string): string => {
      const index = value.indexOf("@");
      return index !== -1 ? value.substring(index) : value;
    };
  
    const getUser = async (authToken: AuthToken, alias: string): Promise<User | null> => {
      return FakeData.instance.findUserByAlias(alias);
    };
  
    return { navigateToUser, extractAlias, getUser };
    
}

export default useNavigator;