import { FollowActionRequest, FollowCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowCountResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const userService = new UserService(daoFactory);
  const followees = await userService.getFolloweeCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count: followees,
  };
};
