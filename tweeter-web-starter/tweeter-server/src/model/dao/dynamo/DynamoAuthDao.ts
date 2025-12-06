import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthDao } from "../AuthDao";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "AuthTable";

export class DynamoAuthDao implements AuthDao {
  async createAuthToken(alias: string): Promise<string> {
    const token = crypto.randomUUID();
    const now = Date.now();
    const expires = now + 1000 * 60 * 60 * 24;

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          token,
          alias,
          timestamp: expires,
        },
      })
    );

    return token;
  }

  async validateAuthToken(token: string): Promise<boolean> {
    const resp = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    if (!resp.Item) return false;

    if (Date.now() > resp.Item.timestamp) {
      await this.deleteAuthToken(token);
      return false;
    }

    return true;
  }

  async deleteAuthToken(token: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );
  }

  async getAliasFromToken(token: string): Promise<string | null> {
    const resp = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    if (!resp.Item) return null;

    if (Date.now() > resp.Item.timestamp) {
      await this.deleteAuthToken(token);
      return null;
    }

    return resp.Item.alias;
  }
}
