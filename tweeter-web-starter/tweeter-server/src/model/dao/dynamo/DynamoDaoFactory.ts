import { AuthDao } from "../AuthDao";
import { DaoFactory } from "../DaoFactory";
import { FollowDao } from "../FollowDao";
import { ImageDao } from "../ImageDao";
import { StatusDao } from "../StatusDao";
import { UserDao } from "../UserDao";
import { DynamoAuthDao } from "./DynamoAuthDao";
import { DynamoFollowDao } from "./DynamoFollowDao";
import { S3ImageDao } from "./S3ImageDao";
import { DynamoStatusDao } from "./DynamoStatusDao";
import { DynamoUserDao } from "./DynamoUserDao";

export class DynamoDaoFactory implements DaoFactory {
  getUserDao(): UserDao {
    return new DynamoUserDao();
  }
  getFollowDao(): FollowDao {
    return new DynamoFollowDao();
  }
  getAuthDao(): AuthDao {
    return new DynamoAuthDao();
  }
  getStatusDao(): StatusDao {
    return new DynamoStatusDao();
  }
  getImageDao(): ImageDao {
    return new S3ImageDao();
  }
}
