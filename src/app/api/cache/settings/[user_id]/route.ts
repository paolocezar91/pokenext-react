import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  const body = await req.json();
  const user_id = (await params).user_id;

  try {
    const response = await fetch(`http://localhost:4006/user/${user_id}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const settings = await response.json();
    return NextResponse.json(settings, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Redis Error', err }, { status: 500 });
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  const user_id = (await params).user_id;

  try {
    const response = await fetch(`http://localhost:4006/user/${user_id}/settings`);
    const settings = await response.json();
    return NextResponse.json(settings, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Redis Error', err }, { status: 500 });
  }
}