import { getDnsData } from '@/lib/dns';
import { ProviderToUrlMapping } from '@/constants/api';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const { provider } = params;
  if (provider) {
    try {
      const { record_type, query } = await request.json();
      const dnsUrl = ProviderToUrlMapping[provider as keyof typeof ProviderToUrlMapping];
      if (record_type === 'PTR' || record_type === 12) {
        // For PTR Lookups we need to reverse the IP Address.
        const ip = query.split('.').reverse().join('.');
        const reverseIp = `${ip}.in-addr.arpa`;
        const dnsData = await getDnsData(reverseIp, record_type, dnsUrl);
        const success = dnsData.Status === 0;
        return NextResponse.json({ success, data: dnsData });

      } else {
        const dnsData = await getDnsData(query, record_type, dnsUrl);
        const success = dnsData.Status === 0;
        return NextResponse.json({ success, data: dnsData });
      }
    } catch (error) {
      return NextResponse.json({ success: false, data: error });
    }
  } else {
    return NextResponse.json({ success: false, data: 'Invalid Provider' })
  }
}