import { getDashboardData } from "../../../../lib/ecoroute-store";
import { getDelhiRegionData } from "../../../../lib/ecoroute-domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const dashboard = await getDashboardData();
  const region = getDelhiRegionData({
    openReports: dashboard.totals.openReports,
    activeWorkers: dashboard.totals.activeWorkers,
    routeEfficiency: dashboard.operations.routeEfficiency,
    avgResponseMinutes: dashboard.operations.averageResponseMinutes,
  });

  return Response.json({
    ok: true,
    region,
  });
}
