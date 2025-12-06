import { FollowActionRequest, FollowCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowCountResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const userService = new UserService(daoFactory);
  const followers = await userService.getFollowerCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count: followers,
  };
};
