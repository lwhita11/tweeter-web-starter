import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowDao } from "../FollowDao";
import { UserDto } from "tweeter-shared";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "FollowTable";
const FOLLOWEE_INDEX = "FolloweeIndex";

export class DynamoFollowDao implements FollowDao {
  async getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[{ followee_alias: string; follower_alias: string }[], boolean]> {
    const params: any = {
      TableName: TABLE_NAME,
      IndexName: FOLLOWEE_INDEX,
      KeyConditionExpression: "followee_alias = :u",
      ExpressionAttributeValues: {
        ":u": userAlias,
      },
      Limit: pageSize,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        followee_alias: userAlias,
        follower_alias: lastItem.alias,
      };
    }

    const result = await docClient.send(new QueryCommand(params));

    const users = (result.Items ?? []).map((item: any) => ({
      followee_alias: item.followee_alias,
      follower_alias: item.follower_alias,
    }));

    return [users, !!result.LastEvaluatedKey];
  }

  async getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[{ followee_alias: string; follower_alias: string }[], boolean]> {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "follower_alias = :u",
      ExpressionAttributeValues: {
        ":u": userAlias,
      },
      Limit: pageSize,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        follower_alias: userAlias,
        followee_alias: lastItem.alias,
      };
    }

    const result = await docClient.send(new QueryCommand(params));

    const users = (result.Items ?? []).map((item: any) => ({
      followee_alias: item.followee_alias,
      follower_alias: item.follower_alias,
    }));
    return [users, !!result.LastEvaluatedKey];
  }

  async follow(userAlias: string, userAliasToFollow: string): Promise<void> {
    this.putItem(userAlias, userAliasToFollow);
  }

  async unfollow(
    userAlias: string,
    userAliasToUnfollow: string
  ): Promise<void> {
    await this.deleteItem(userAlias, userAliasToUnfollow);
  }

  async isFollower(
    userAlias: string,
    otherUserAlias: string
  ): Promise<boolean> {
    const result = await this.getItem(userAlias, otherUserAlias);
    return !!result.Item;
  }

  async putItem(followerAlias: string, followeeAlias: string) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        follower_alias: followerAlias,
        followee_alias: followeeAlias,
      },
    });
    return await docClient.send(command);
  }

  async getItem(followerAlias: string, followeeAlias: string) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { follower_alias: followerAlias, followee_alias: followeeAlias },
    });
    return await docClient.send(command);
  }

  async updateItem(
    followerAlias: string,
    followeeAlias: string,
    newFollowerName: string,
    newFolloweeName: string
  ) {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { follower_alias: followerAlias, followee_alias: followeeAlias },
      UpdateExpression: "SET follower_name = :fn, followee_name = :fe",
      ExpressionAttributeValues: {
        ":fn": newFollowerName,
        ":fe": newFolloweeName,
      },
      ReturnValues: "UPDATED_NEW",
    });
    return await docClient.send(command);
  }

  async deleteItem(followerAlias: string, followeeAlias: string) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { follower_alias: followerAlias, followee_alias: followeeAlias },
      ReturnValues: "ALL_OLD",
    });
    const result = await docClient.send(command);
    console.log("Deleted item:", result);
    return result;
  }

  async getFollowerCount(alias: string): Promise<number> {
    let total = 0;
    let ExclusiveStartKey: any = undefined;

    do {
      const resp = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: FOLLOWEE_INDEX,
          KeyConditionExpression: "followee_alias = :alias",
          ExpressionAttributeValues: { ":alias": alias },
          Select: "COUNT",
          ExclusiveStartKey,
        })
      );

      total += resp.Count ?? 0;
      ExclusiveStartKey = resp.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return total;
  }

  async getFolloweeCount(alias: string): Promise<number> {
    let total = 0;
    let ExclusiveStartKey: any = undefined;

    do {
      const resp = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "follower_alias = :alias",
          ExpressionAttributeValues: { ":alias": alias },
          Select: "COUNT",
          ExclusiveStartKey,
        })
      );

      total += resp.Count ?? 0;
      ExclusiveStartKey = resp.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return total;
  }
}
