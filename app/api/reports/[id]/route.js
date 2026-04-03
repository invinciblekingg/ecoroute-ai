import { z } from "zod";
import { getDashboardData, getReportById, updateReport } from "../../../../lib/ecoroute-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  action: z.enum(["assign", "start", "complete", "resolve", "reopen", "update"]).default("update"),
  workerId: z.string().trim().optional().default(""),
  cleanupProofUrl: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
  status: z.string().trim().optional().default(""),
});

export async function GET(_request, { params }) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    return Response.json({ ok: false, message: "Report not found." }, { status: 404 });
  }

  return Response.json({
    ok: true,
    report,
  });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  const result = schema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      {
        ok: false,
        message: "Please check the update payload.",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const updated = await updateReport(id, result.data);
  if (!updated) {
    return Response.json({ ok: false, message: "Report not found." }, { status: 404 });
  }

  const dashboard = await getDashboardData();

  return Response.json({
    ok: true,
    message: "Report updated.",
    report: updated,
    summary: dashboard,
  });
}
