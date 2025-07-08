import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { WinEvent } from "@/app/WinEventsContext";

const KEY = "winevents.json";
var localEvents: WinEvent[] = []

export async function GET() {
  const url = "https://aw0ziblxni61syli.public.blob.vercel-storage.com/" + KEY;
  const res = await fetch(url);
  const text = await res.text();
  const events = JSON.parse(text);
  const resp = new NextResponse(JSON.stringify(localEvents), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  });
  localEvents = events;
  return resp;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    localEvents = data;
    // Store updated events in blob storage
    await put(KEY, JSON.stringify(data), { access: "public", allowOverwrite: true });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update win events" }, { status: 400 });
  }
}
