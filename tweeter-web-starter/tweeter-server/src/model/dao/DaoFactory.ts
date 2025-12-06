import { AuthDao } from "./AuthDao";
import { FollowDao } from "./FollowDao";
import { ImageDao } from "./ImageDao";
import { StatusDao } from "./StatusDao";
import { UserDao } from "./UserDao";

export interface DaoFactory {
  getUserDao(): UserDao;
  getFollowDao(): FollowDao;
  getAuthDao(): AuthDao;
  getStatusDao(): StatusDao;
  getImageDao(): ImageDao;
}
