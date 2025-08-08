import { NextRequest, NextResponse } from 'next/server';
import { gql, request } from 'graphql-request';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  const { user_id } = await params;
  const query = gql`
    query ($user_id: ID!) {
      userSettings(user_id: $user_id) {
        id
        user { id }
        artworkUrl
        descriptionLang
        listTable
        showColumn
        showShowColumn
        showThumbTable
        thumbLabelList
        thumbSizeList
        typeArtworkUrl
        filter { name types }
        sorting { key dir }
      }
    }
  `;

  try {
    const { userSettings } = await request<{ userSettings: Record<string, unknown> }>(apiUrl, query, { user_id });
    if (userSettings) {
      return NextResponse.json(serializeSettings(userSettings), { status: 200 });
    } else {
      return NextResponse.json(null, { status: 200 });
    }
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  const user_id = (await params).user_id;
  const body = await req.json();
  const input = parseSettings(user_id!, body);
  const mutation = gql`
    mutation upsertUserSettings($input: UserSettingsInput!) {
      upsertUserSettings(input: $input) {
        id
        user { id }
        artworkUrl
        descriptionLang
        listTable
        showColumn
        showShowColumn
        showThumbTable
        thumbLabelList
        thumbSizeList
        typeArtworkUrl
        filter { name types }
        sorting { key dir }
      }
    }
  `;
  try {
    const { upsertUserSettings } = await request<{ upsertUserSettings: Record<string, unknown> }>(apiUrl, mutation, { input });
    return NextResponse.json(serializeSettings(upsertUserSettings), { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}

const parseSettings = (userId: string, data: Record<string, unknown>) => {
  return {
    userId,
    artworkUrl: data.artworkUrl,
    descriptionLang: data.descriptionLang,
    listTable: data.listTable,
    showColumn: (data.showColumn as boolean[])?.reduce((str, bool) => str + (bool ? 'y' : 'n'), ''),
    showShowColumn: data.showShowColumn,
    showThumbTable: data.showThumbTable,
    thumbLabelList: data.thumbLabelList,
    thumbSizeList: data.thumbSizeList,
    typeArtworkUrl: data.typeArtworkUrl,
    filter: data.filter,
    sorting: data.sorting
  };
};

const serializeSettings = (data: Record<string, unknown>) => {
  const showColumn = Array.from(data.showColumn as string).map(v => v === 'y' ? true : false);
  return { ...data, showColumn };
};
