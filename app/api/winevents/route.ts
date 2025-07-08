import { NextResponse } from "next/server";

// Dummy data for demo; replace with DB call as needed
let winEvents = [
  { id: 1, value: 200, won: false, earliestWin: "2025-07-08T12:40:00+10:00" },
  { id: 2, value: 100, won: true, earliestWin: "2025-07-08T10:00:00+10:00" },
  { id: 3, value: 50, won: true, earliestWin: "2025-07-08T12:00:00+10:00" },
];

export async function GET() {
  // In production, fetch from DB here
  console.log(">>>>", winEvents);
  return NextResponse.json(winEvents);
}

export async function POST(req: Request) {
  // Accept updated winEvents array and store in memory
  try {
    const data = await req.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    // Validate event objects (optional, for demo just replace)
    winEvents = data;
    return NextResponse.json(winEvents);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update win events" }, { status: 400 });
  }
}
