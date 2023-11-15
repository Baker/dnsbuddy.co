import whoiser from 'whoiser';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const whoisData = await whoiser(query, { follow: 1 });
    return NextResponse.json({
      success: true,
      data: whoisData,
      length: whoisData.length,
    });
  } catch (error) {
    return NextResponse.json({ success: false, data: error });
  }
}
