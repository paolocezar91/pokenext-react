import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const settings = await req.json();
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": `user_settings=${encodeURIComponent(JSON.stringify(settings))}; Path=/; Max-Age=${30 * 24 * 60 * 60}`,
      },
    },
  );
}
