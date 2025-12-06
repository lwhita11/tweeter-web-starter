import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  const daoFactory = new DynamoDaoFactory();
  const statusService = new StatusService(daoFactory);
  await statusService.postStatus(request.token, request.status);

  return {
    success: true,
    message: null,
  };
};
