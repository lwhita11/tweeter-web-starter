import "isomorphic-fetch";
import { ServerFacade } from "../../../src/model.network/ServerFacade";
import {
  RegisterRequest,
  FollowActionRequest,
  PagedUserItemRequest,
} from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  const serverFacade = new ServerFacade();

  test("register works", async () => {
    const request: RegisterRequest = {
      firstName: "Test",
      lastName: "User",
      alias: "@testUser123",
      password: "password",
      userImageBytes: "addfadfsdaf", // or real bytes,
      imageFileExtension: "extension",
    };

    const [user, token] = await serverFacade.register(request);

    expect(user).not.toBeNull();
    expect(token).not.toBeNull();
    expect(token.token).not.toBeNull();
    expect(typeof user.alias).toBe("string");
    expect(typeof user.firstName).toBe("string");
    expect(typeof user.lastName).toBe("string");
    expect(typeof token.token).toBe("string");
    expect(token.token).not.toBe("");
  });

  test("getMoreFollowers works", async () => {
    const request: PagedUserItemRequest = {
      userAlias: "myAlias",
      pageSize: 10,
      token: "authToken",
      lastItem: {
        firstName: "test",
        lastName: "user",
        alias: "otherAlias",
        imageUrl: "url",
      },
    };

    const [users, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(users).not.toBeNull();
    expect(hasMore).not.toBeNull();
    expect(Array.isArray(users)).toBe(true);
  });

  test("getFollowerCount works", async () => {
    const request: FollowActionRequest = {
      token: "authToken",
      user: {
        firstName: "test",
        lastName: "user",
        alias: "otherAlias",
        imageUrl: "url",
      },
    };

    const count = await serverFacade.getFollowerCount(request);

    expect(count).not.toBeNull();
    expect(count).toBeGreaterThan(0);
  });
});
