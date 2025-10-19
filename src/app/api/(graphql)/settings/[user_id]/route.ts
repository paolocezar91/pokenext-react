import { authorizedQueryGraphql } from "@/app/services/graphql";
import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  // debug incoming cookies
  console.log(
    "GET /api/settings ... cookie header:",
    req.headers.get("cookie")
  );

  const { user_id } = await params;
  const query = gql`
    query ($user_id: ID!) {
      userSettings(user_id: $user_id) {
        id
        user {
          id
        }
        artworkUrl
        descriptionLang
        listTable
        showColumn
        showSettings
        showShowColumn
        showThumbTable
        thumbLabelList
        thumbSizeList
        typeArtworkUrl
        filter {
          name
          types
        }
        sorting {
          key
          dir
        }
      }
    }
  `;

  try {
    const { userSettings } = await authorizedQueryGraphql<{
      userSettings: Record<string, unknown>;
    }>(req, query, { user_id });

    if (userSettings) {
      return NextResponse.json(serializeSettings(userSettings), {
        status: 200,
      });
    } else {
      return NextResponse.json(null, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const user_id = (await params).user_id;
  const body = await req.json();
  const input = parseSettings(user_id!, body);
  const mutation = gql`
    mutation upsertUserSettings($input: UserSettingsInput!) {
      upsertUserSettings(input: $input) {
        id
        user {
          id
        }
        artworkUrl
        descriptionLang
        listTable
        showColumn
        showSettings
        showShowColumn
        showThumbTable
        thumbLabelList
        thumbSizeList
        typeArtworkUrl
        filter {
          name
          types
        }
        sorting {
          key
          dir
        }
      }
    }
  `;

  try {
    const { upsertUserSettings } = await authorizedQueryGraphql<{
      upsertUserSettings: Record<string, unknown>;
    }>(req, mutation, { input });
    const response = serializeSettings(upsertUserSettings);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}

const parseSettings = (userId: string, data: Record<string, unknown>) => {
  return {
    userId,
    artworkUrl: data.artworkUrl,
    descriptionLang: data.descriptionLang,
    listTable: data.listTable,
    showColumn: (data.showColumn as boolean[])?.reduce(
      (str, bool) => str + (bool ? "y" : "n"),
      ""
    ),
    showSettings: data.showSettings,
    showShowColumn: data.showShowColumn,
    showThumbTable: data.showThumbTable,
    thumbLabelList: data.thumbLabelList,
    thumbSizeList: data.thumbSizeList,
    typeArtworkUrl: data.typeArtworkUrl,
    filter: data.filter,
    sorting: data.sorting,
  };
};

const serializeSettings = (data: Record<string, unknown>) => {
  const showColumn = data.showColumn
    ? Array.from(data.showColumn as string).map((v) =>
      v === "y" ? true : false
    )
    : null;
  return { ...data, showColumn };
};
