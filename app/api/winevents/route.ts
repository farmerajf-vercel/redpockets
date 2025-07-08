import { NextResponse } from "next/server";

// Dummy data for demo; replace with DB call as needed
const winEvents = [
//   { id: 1, value: 200, won: false, earliestWin: "2025-07-08T11:45:00+10:00" },
  { id: 2, value: 100, won: true, earliestWin: "2025-07-08T10:00:00+10:00" },
  { id: 3, value: 50, won: false, earliestWin: "2025-07-08T12:00:00+10:00" },
];

export async function GET() {
  // In production, fetch from DB here
  return NextResponse.json(winEvents);
}
