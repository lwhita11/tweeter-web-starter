import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useContext } from "react";

export const useUserInfoActions = () => {
    return useContext(UserInfoActionsContext);
}

export const useUserInfo = () => {
    return useContext(UserInfoContext);
}