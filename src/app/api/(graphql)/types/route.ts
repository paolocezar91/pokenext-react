import { getAllTypes } from "@/app/services/type";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { types } = await getAllTypes();
    return NextResponse.json(types, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
