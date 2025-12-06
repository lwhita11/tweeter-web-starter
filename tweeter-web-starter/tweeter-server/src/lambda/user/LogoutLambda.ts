import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: LogoutRequest
): Promise<LogoutResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const userService = new UserService(daoFactory);

  await userService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
