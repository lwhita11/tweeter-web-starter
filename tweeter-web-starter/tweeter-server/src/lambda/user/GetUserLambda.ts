import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const userService = new UserService(daoFactory);

  const user = await userService.getUser(request.token, request.alias);

  return {
    success: true,
    message: null,
    user: user,
  };
};
