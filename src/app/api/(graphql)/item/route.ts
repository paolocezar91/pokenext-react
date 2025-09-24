import { ResultsCount } from "@/app/api/api-utils";
import { getAllItem, getItemByIds } from "@/app/services/item";
import { NextRequest, NextResponse } from "next/server";
import { IItem } from "pokeapi-typescript";

export async function GET(req: NextRequest) {
  try {
    let response: ResultsCount<IItem>;
    const ids = req.nextUrl.searchParams.get("ids") ?? "";
    if (ids) {
      response = await getItemByIds({ ids });
    } else {
      const vars = {
        limit: Number(req.nextUrl.searchParams.get("limit")),
        offset: Number(req.nextUrl.searchParams.get("offset")),
        name: req.nextUrl.searchParams.get("name") ?? undefined,
      };
      response = await getAllItem(vars);
    }
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
