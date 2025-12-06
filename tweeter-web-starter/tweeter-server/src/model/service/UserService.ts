import { Buffer } from "buffer";
import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../dao/DaoFactory";
import { UserDao } from "../dao/UserDao";
import { AuthDao } from "../dao/AuthDao";
import bcrypt from "bcryptjs";
import { ImageDao } from "../dao/ImageDao";
import { FollowDao } from "../dao/FollowDao";

export class UserService implements Service {
  private userDao: UserDao;
  private authDao: AuthDao;
  private followDao: FollowDao;
  private imageDao: ImageDao;

  constructor(factory: DaoFactory) {
    this.userDao = factory.getUserDao();
    this.authDao = factory.getAuthDao();
    this.followDao = factory.getFollowDao();
    this.imageDao = factory.getImageDao();
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    return this.userDao.getUser(alias);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    const storedPwd = await this.userDao.getPasswordHash(alias);
    this.checkAuthError(storedPwd);
    const isValid = await bcrypt.compare(password, storedPwd!);
    if (!isValid) {
      throw new Error("Alias or Password is incorrect");
    }
    const authToken = await this.authDao.createAuthToken(alias);
    const user = await this.userDao.getUser(alias);
    this.checkAuthError(user);
    return [user!, authToken];
  }

  private checkAuthError(obj: any): void {
    if (obj == null) {
      throw new Error("Alias or Password is incorrect");
    }
  }

  private async hashPassword(textPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(textPassword, salt);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    if ((await this.userDao.getUser(alias)) != null) {
      throw new Error("Alias is taken");
    }
    const hashedPwd = await this.hashPassword(password);
    const imageBytes = Uint8Array.from(Buffer.from(userImageBytes, "base64"));
    const imageUrl = await this.imageDao.uploadImage(
      alias,
      imageBytes,
      imageFileExtension
    );
    await this.userDao.createUser(
      firstName,
      lastName,
      alias,
      hashedPwd,
      imageUrl
    );
    const authToken = await this.authDao.createAuthToken(alias);

    const user = await this.userDao.getUser(alias);
    if (!user) {
      throw new Error("User not saved");
    }
    return [user, authToken];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    return this.followDao.isFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    return this.followDao.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    return this.followDao.getFollowerCount(user.alias);
  }

  public async logout(authToken: string): Promise<void> {
    await this.authDao.deleteAuthToken(authToken);
  }
}
