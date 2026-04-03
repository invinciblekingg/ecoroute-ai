import { z } from "zod";
import { getWorkerById, updateWorker } from "../../../../lib/ecoroute-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  status: z.string().trim().optional().default(""),
  currentTask: z.string().trim().optional().default(""),
  currentReportId: z.string().trim().optional().default(""),
  routePlanId: z.string().trim().optional().default(""),
  zone: z.string().trim().optional().default(""),
  vehicle: z.string().trim().optional().default(""),
});

export async function GET(_request, { params }) {
  const { id } = await params;
  const worker = await getWorkerById(id);
  if (!worker) {
    return Response.json({ ok: false, message: "Worker not found." }, { status: 404 });
  }

  return Response.json({
    ok: true,
    worker,
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

  const result = updateSchema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      {
        ok: false,
        message: "Please check the worker update payload.",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const updates = Object.fromEntries(
    Object.entries(result.data).filter(([, value]) => value !== "")
  );

  const worker = await updateWorker(id, updates);
  if (!worker) {
    return Response.json({ ok: false, message: "Worker not found." }, { status: 404 });
  }

  return Response.json({
    ok: true,
    message: "Worker updated.",
    worker,
  });
}
