import { NextResponse } from "next/server";
import { syncEvents } from "@/lib/indexer/sync";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await syncEvents();
    console.log("[cron/indexer] Synced:", result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) { console.error("[cron/indexer]", err); return NextResponse.json({ error: "Sync failed" }, { status: 500 }); }
}
