import { NextResponse } from "next/server";
import { dispatch } from "@/lib/notifications";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { category, data, channels } = await request.json();
    await dispatch(category, data, undefined, channels);
    return NextResponse.json({ success: true });
  } catch (err) { console.error("[notifications]", err); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
