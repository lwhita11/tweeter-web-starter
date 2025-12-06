import { UserDto } from "tweeter-shared";

export interface UserDao {
  createUser(
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageUrl: string
  ): Promise<void>;
  getUser(alias: string): Promise<UserDto | null>;
  batchGetUsers(aliases: string[]): Promise<UserDto[]>;
  getPasswordHash(alias: string): Promise<string | null>;
}
