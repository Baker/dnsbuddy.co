import { whoisStringToJson } from "@/lib/whois";
import { lookup } from "@ocku/whois";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, type } = await request.json();
    const data = await lookup(query);
    return NextResponse.json(whoisStringToJson(data));
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
