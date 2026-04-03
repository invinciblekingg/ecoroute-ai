import { getUploadAsset } from "../../../../lib/ecoroute-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const asset = await getUploadAsset(params.id);

  if (!asset) {
    return Response.json({ ok: false, message: "Upload not found." }, { status: 404 });
  }

  return new Response(asset.buffer, {
    headers: {
      "Content-Type": asset.contentType || "application/octet-stream",
      "Content-Length": String(asset.size || asset.buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${asset.fileName || `${params.id}.bin`}"`,
    },
  });
}
