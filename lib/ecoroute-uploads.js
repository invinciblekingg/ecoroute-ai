import { randomUUID } from "crypto";
import path from "path";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import { getMongoDb, hasMongoStorage } from "./mongodb";

const uploadsDir = path.join(process.cwd(), "data", "uploads");
const maxUploadBytes = 4 * 1024 * 1024;

function sanitizeName(value) {
  return String(value || "proof").replace(/[^a-z0-9._-]+/gi, "-");
}

function detectExtension(file) {
  const originalName = sanitizeName(file?.name || "proof");
  return path.extname(originalName) || (file?.type?.startsWith("video/") ? ".mp4" : ".jpg");
}

function detectContentType(asset) {
  if (asset?.contentType) {
    return asset.contentType;
  }

  const extension = path.extname(asset?.fileName || "").toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  if (extension === ".mp4") return "video/mp4";
  if (extension === ".mov") return "video/quicktime";
  return "image/jpeg";
}

async function saveMongoUpload(file, buffer) {
  const db = await getMongoDb();
  const assetId = `upload-${randomUUID()}`;
  const fileName = `${assetId}${detectExtension(file)}`;
  const record = {
    _id: assetId,
    fileName,
    originalName: sanitizeName(file?.name || fileName),
    contentType: file?.type || detectContentType({ fileName }),
    size: buffer.length,
    base64: buffer.toString("base64"),
    createdAt: new Date().toISOString(),
  };

  await db.collection("uploads").insertOne(record);

  return {
    id: assetId,
    url: `/api/uploads/${assetId}`,
    fileName,
    contentType: record.contentType,
    size: record.size,
  };
}

async function saveFileUpload(file, buffer) {
  await mkdir(uploadsDir, { recursive: true });

  const assetId = `upload-${randomUUID()}`;
  const fileName = `${assetId}${detectExtension(file)}`;
  const filePath = path.join(uploadsDir, fileName);
  const metaPath = path.join(uploadsDir, `${assetId}.json`);

  await writeFile(filePath, buffer);
  await writeFile(
    metaPath,
    JSON.stringify(
      {
        id: assetId,
        fileName,
        contentType: file?.type || detectContentType({ fileName }),
        size: buffer.length,
        createdAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );

  return {
    id: assetId,
    url: `/api/uploads/${assetId}`,
    fileName,
    contentType: file?.type || detectContentType({ fileName }),
    size: buffer.length,
  };
}

export async function saveUploadAsset(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size <= 0) {
    return null;
  }

  if (file.size > maxUploadBytes) {
    throw new Error("Uploads must be 4 MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (hasMongoStorage()) {
    try {
      return await saveMongoUpload(file, buffer);
    } catch {
      return saveFileUpload(file, buffer);
    }
  }

  return saveFileUpload(file, buffer);
}

async function readMongoUpload(assetId) {
  const db = await getMongoDb();
  const asset = await db.collection("uploads").findOne({ _id: assetId });

  if (!asset?.base64) {
    return null;
  }

  return {
    id: asset._id,
    fileName: asset.fileName,
    contentType: asset.contentType || detectContentType(asset),
    size: asset.size ?? 0,
    buffer: Buffer.from(asset.base64, "base64"),
  };
}

async function readFileUpload(assetId) {
  const metaPath = path.join(uploadsDir, `${assetId}.json`);

  try {
    const metadata = JSON.parse(await readFile(metaPath, "utf8"));
    const filePath = path.join(uploadsDir, metadata.fileName);
    const [buffer, info] = await Promise.all([readFile(filePath), stat(filePath)]);

    return {
      id: assetId,
      fileName: metadata.fileName,
      contentType: metadata.contentType || detectContentType(metadata),
      size: metadata.size ?? info.size,
      buffer,
    };
  } catch {
    return null;
  }
}

export async function getUploadAsset(assetId) {
  if (!assetId) {
    return null;
  }

  if (hasMongoStorage()) {
    try {
      return await readMongoUpload(assetId);
    } catch {
      return readFileUpload(assetId);
    }
  }

  return readFileUpload(assetId);
}
