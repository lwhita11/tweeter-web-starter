import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const userService = new UserService();
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
