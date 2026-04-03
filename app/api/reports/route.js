import { z } from "zod";
import { createReport, getDashboardData, listReports } from "../../../lib/ecoroute-store";
import { saveUploadAsset } from "../../../lib/ecoroute-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  reporterName: z.string().trim().min(2, "Reporter name is required"),
  contact: z.string().trim().optional().default(""),
  locationId: z.string().trim().optional().default(""),
  locationLabel: z.string().trim().optional().default(""),
  category: z.enum(["plastic", "organic", "hazardous", "e-waste"]),
  severity: z.union([z.string(), z.number()]).optional().default("3"),
  description: z.string().trim().min(8, "Describe the waste issue"),
  notes: z.string().trim().optional().default(""),
  latitude: z.union([z.string(), z.number()]).optional().default(""),
  longitude: z.union([z.string(), z.number()]).optional().default(""),
  imageUrl: z.string().trim().optional().default(""),
  videoUrl: z.string().trim().optional().default(""),
  proofUrl: z.string().trim().optional().default(""),
  source: z.string().trim().optional().default("web"),
});

async function parseBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const payload = {};
    let proofFile = null;

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        payload[key] = value;
      } else if (value && typeof value === "object" && typeof value.arrayBuffer === "function") {
        proofFile = value;
      }
    }

    const asset = await saveUploadAsset(proofFile);
    if (asset) {
      payload.proofUrl = asset.url;
      const type = proofFile?.type || "";
      if (type.startsWith("image/")) {
        payload.imageUrl = asset.url;
      } else if (type.startsWith("video/")) {
        payload.videoUrl = asset.url;
      }
    }

    return payload;
  }

  return request.json();
}

export async function GET(request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const category = url.searchParams.get("category");
  const limit = url.searchParams.get("limit");
  const reports = await listReports({ status, category, limit });
  const dashboard = await getDashboardData();

  return Response.json({
    ok: true,
    count: reports.length,
    reports,
    summary: dashboard,
  });
}

export async function POST(request) {
  let payload;

  try {
    payload = await parseBody(request);
  } catch (error) {
    return Response.json({ ok: false, message: error?.message || "Invalid request body." }, { status: 400 });
  }

  const result = schema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      {
        ok: false,
        message: "Please check the report form and try again.",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const report = await createReport(result.data);
  const dashboard = await getDashboardData();

  return Response.json(
    {
      ok: true,
      message: "Waste report created.",
      report,
      summary: dashboard,
    },
    { status: 201 }
  );
}
