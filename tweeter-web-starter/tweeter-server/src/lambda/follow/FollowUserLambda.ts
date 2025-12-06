import {
  FollowActionRequest,
  FollowActionResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowActionResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const followService = new FollowService(daoFactory);
  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
