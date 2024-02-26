import { NextRequest, NextResponse } from 'next/server';
import * as Ably from "ably/promises";

export async function POST(req: Request) {
  if (!process.env.ABLY_API_KEY) {
    return NextResponse.json({
      errorMessage: `Missing ABLY_API_KEY environment variable.`,
    }, {
      status: 500,
      headers: new Headers({
        "content-type": "application/json"
      })
    });
  }

  const client = new Ably.Rest(process.env.ABLY_API_KEY);

  var channel = client.channels.get('status-updates');
  const message: { text: string; } = await req.json();

  await channel.publish('update-from-server', message);
  return new Response("");
}
