import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDto } from "tweeter-shared";
import { UserDao } from "../UserDao";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "UserTable";

export class DynamoUserDao implements UserDao {
  async createUser(
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageUrl: string
  ): Promise<void> {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          alias,
          firstName,
          lastName,
          passwordHash: hashedPassword,
          imageUrl,
          followers: 0,
          followees: 0,
        },
      })
    );
  }

  async getUser(alias: string): Promise<UserDto | null> {
    const resp = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );

    if (!resp.Item) return null;

    return {
      alias: resp.Item.alias,
      firstName: resp.Item.firstName,
      lastName: resp.Item.lastName,
      imageUrl: resp.Item.imageUrl,
    };
  }

  async batchGetUsers(aliases: string[]): Promise<UserDto[]> {
    if (aliases.length < 1) {
      return [];
    }
    const keys = aliases.map((alias) => ({ alias }));

    const params = {
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keys,
        },
      },
    };

    const result = await docClient.send(new BatchGetCommand(params));
    const items = result.Responses?.[TABLE_NAME] ?? [];

    return items.map((i) => ({
      firstName: i.firstName,
      lastName: i.lastName,
      alias: i.alias,
      imageUrl: i.imageUrl,
    }));
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const resp = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
        ProjectionExpression: "passwordHash",
      })
    );
    return resp.Item?.passwordHash ?? null;
  }
}
