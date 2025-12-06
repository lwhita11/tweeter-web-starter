import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { StatusDao } from "../StatusDao";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "StatusTable";
const FEED_TABLE = "FeedTable";

export class DynamoStatusDao implements StatusDao {
  async getStoryItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "user_alias = :alias AND #ts < :t",
      ExpressionAttributeNames: { "#ts": "timestamp" },
      ExpressionAttributeValues: {
        ":alias": alias,
        ":t": Date.now(),
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { user_alias: alias, timestamp: lastItem.timestamp }
        : undefined,
      ScanIndexForward: false,
    });

    const result = await docClient.send(command);

    return [
      (result.Items ?? []) as StatusDto[],
      result.LastEvaluatedKey != null,
    ];
  }

  async getFeedItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const command = new QueryCommand({
      TableName: FEED_TABLE,
      KeyConditionExpression: "follower_alias = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { follower_alias: alias, timestamp: lastItem.timestamp }
        : undefined,
      ScanIndexForward: false,
    });

    const result = await docClient.send(command);

    const statuses = (result.Items ?? []).map(
      (item: any) => item.status as StatusDto
    );

    return [statuses, result.LastEvaluatedKey != null];
  }

  async postStatus(posterAlias: string, status: StatusDto): Promise<void> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        user_alias: posterAlias,
        timestamp: status.timestamp,
        post: status.post,
        user: status.user,
        segments: status.segments,
      },
    });

    await docClient.send(command);
  }

  async insertFeedItem(
    followerAlias: string,
    posterAlias: string,
    status: StatusDto
  ): Promise<void> {
    const command = new PutCommand({
      TableName: FEED_TABLE,
      Item: {
        follower_alias: followerAlias,
        timestamp: status.timestamp,
        poster_alias: posterAlias,
        status: status,
      },
    });

    await docClient.send(command);
  }
}
