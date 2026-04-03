import { randomUUID } from "crypto";
import path from "path";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import { getBundledUploadsDir, getUploadsDir } from "./storage-paths";
import { hasSupabaseStorage, insertSupabaseRow, selectSupabaseRows } from "./supabase";

const uploadsDir = getUploadsDir();
const bundledUploadsDir = getBundledUploadsDir();
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

async function saveSupabaseUpload(file, buffer) {
  const assetId = `upload-${randomUUID()}`;
  const fileName = `${assetId}${detectExtension(file)}`;
  const record = await insertSupabaseRow("uploads", {
    id: assetId,
    file_name: fileName,
    original_name: sanitizeName(file?.name || fileName),
    content_type: file?.type || detectContentType({ fileName }),
    size: buffer.length,
    base64: buffer.toString("base64"),
    created_at: new Date().toISOString(),
  });

  return {
    id: assetId,
    url: `/api/uploads/${assetId}`,
    fileName,
    contentType: record?.content_type || file?.type || detectContentType({ fileName }),
    size: record?.size ?? buffer.length,
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

  if (hasSupabaseStorage()) {
    try {
      return await saveSupabaseUpload(file, buffer);
    } catch {
      return saveFileUpload(file, buffer);
    }
  }

  return saveFileUpload(file, buffer);
}

async function readSupabaseUpload(assetId) {
  const rows = await selectSupabaseRows("uploads", {
    select: "id,file_name,content_type,size,base64",
    filters: { id: `eq.${assetId}` },
    limit: 1,
  });
  const asset = rows[0];

  if (!asset?.base64) {
    return null;
  }

  return {
    id: asset.id,
    fileName: asset.file_name,
    contentType: asset.content_type || detectContentType(asset),
    size: asset.size ?? 0,
    buffer: Buffer.from(asset.base64, "base64"),
  };
}

async function readFileUpload(assetId) {
  for (const baseDir of [uploadsDir, bundledUploadsDir]) {
    const metaPath = path.join(baseDir, `${assetId}.json`);

    try {
      const metadata = JSON.parse(await readFile(metaPath, "utf8"));
      const filePath = path.join(baseDir, metadata.fileName);
      const [buffer, info] = await Promise.all([readFile(filePath), stat(filePath)]);

      return {
        id: assetId,
        fileName: metadata.fileName,
        contentType: metadata.contentType || detectContentType(metadata),
        size: metadata.size ?? info.size,
        buffer,
      };
    } catch {
      continue;
    }
  }

  return null;
}

export async function getUploadAsset(assetId) {
  if (!assetId) {
    return null;
  }

  if (hasSupabaseStorage()) {
    try {
      return await readSupabaseUpload(assetId);
    } catch {
      return readFileUpload(assetId);
    }
  }

  return readFileUpload(assetId);
}
