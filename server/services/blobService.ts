import "dotenv/config";
import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "menu-images";

// ❌ DO NOT crash during build
if (!connectionString) {
  console.warn("AZURE_STORAGE_CONNECTION_STRING not found");
}

const blobServiceClient = connectionString
  ? BlobServiceClient.fromConnectionString(connectionString)
  : null;

export const uploadToBlob = async (
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  if (!blobServiceClient) {
    throw new Error("Blob service not initialized");
  }

  const containerClient = blobServiceClient.getContainerClient(containerName);

  // ensure container exists
  await containerClient.createIfNotExists({
    access: "blob",
  });

  const blobName = `${Date.now()}-${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return blockBlobClient.url;
};