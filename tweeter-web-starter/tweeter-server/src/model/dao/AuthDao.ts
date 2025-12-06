export interface AuthDao {
  createAuthToken(alias: string): Promise<string>;

  validateAuthToken(token: string): Promise<boolean>;

  deleteAuthToken(token: string): Promise<void>;

  getAliasFromToken(token: string): Promise<string | null>;
}
