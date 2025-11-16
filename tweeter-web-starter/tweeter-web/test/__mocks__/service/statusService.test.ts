import "isomorphic-fetch";
import { StatusService } from "../../../src/model.service/StatusService";
import { AuthToken, User } from "tweeter-shared";

describe("StatusService Integration Test", () => {
  const service = new StatusService();

  test("Loads story items successfully", async () => {
    const fakeToken = new AuthToken("dummy-token", Date.now());
    const user = new User("Test", "User", "@existingUser", "URL");

    const [statuses, hasMore] = await service.loadMoreStoryItems(
      fakeToken,
      user.alias,
      10,
      null
    );

    expect(statuses).not.toBeNull();
    expect(hasMore).not.toBeNull();
    expect(Array.isArray(statuses)).toBe(true);
    expect(typeof hasMore).toBe("boolean");
  });
});
