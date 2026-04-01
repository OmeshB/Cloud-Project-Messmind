import "dotenv/config";
import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "menu-images";

if (!connectionString) {
  throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

export const uploadToBlob = async (
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobName = `${Date.now()}-${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return blockBlobClient.url;
};