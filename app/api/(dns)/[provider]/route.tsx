import { NextResponse } from 'next/server';

import { getDnsData } from '@/lib/dns';
import { ProviderToUrlMapping } from '@/constants/api';

export async function POST(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;
  if (provider) {
    try {
      const res = await request.json();
      const recordType = res.record_type;
      const query = res.query;
      const dnsUrl =
        ProviderToUrlMapping[provider as keyof typeof ProviderToUrlMapping];
      const dnsData = await getDnsData(query, recordType, dnsUrl);
      if (dnsData.error) {
        return NextResponse.json({ success: false, data: dnsData });
      }
      if (dnsData.Status == 0) {
        return NextResponse.json({ success: true, data: dnsData });
      }
      return NextResponse.json({ success: false, data: dnsData });
    } catch (error) {
      return NextResponse.json({ success: false, data: error });
    }
  } else {
    return {
      notFound: true,
    };
  }
}
