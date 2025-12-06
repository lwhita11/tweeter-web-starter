import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const userService = new UserService(daoFactory);
  const isFollower = await userService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
