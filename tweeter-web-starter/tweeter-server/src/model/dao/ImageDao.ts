export interface ImageDao {
  uploadImage(
    key: string,
    imageBytes: Uint8Array,
    extension: string
  ): Promise<string>;
}
