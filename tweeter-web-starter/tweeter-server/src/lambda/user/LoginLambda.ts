import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const userService = new UserService(daoFactory);

  const [UserDto, authToken] = await userService.login(
    request.alias,
    request.password
  );

  return {
    success: true,
    message: null,
    user: UserDto,
    authToken: authToken,
  };
};
