import { FollowActionRequest, FollowCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowCountResponse> => {
  const userService = new UserService();
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
