import { getAllMoves, getMoveByIds } from "@/app/services/move";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const ids = req.nextUrl.searchParams.get("ids") ?? "";
    const response = ids ? await getMoveByIds({ ids }) : await getAllMoves();
    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json({ error: "GraphQL error" }, { status: 500 });
  }
}
