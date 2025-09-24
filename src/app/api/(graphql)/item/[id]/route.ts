import { idOrName } from "@/app/api/api-utils";
import { getItemById } from "@/app/services/item";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vars = idOrName(id);

  try {
    const { itemById } = await getItemById(vars);
    return NextResponse.json(itemById, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
