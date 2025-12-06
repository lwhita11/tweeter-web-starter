import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const userService = new UserService(daoFactory);

  const [UserDto, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    user: UserDto,
    authToken: authToken,
  };
};
