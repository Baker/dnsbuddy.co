// TODO: Fix the checks
// @ts-nocheck
import whoiser from 'whoiser';
import { NextResponse } from 'next/server';
import { DomainWhoisData } from '@/lib/types/whois';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const data = await whoiser(query, { follow: 1 });
    // This means it was a domain lookup.
    if (Object.values(data).length === 1) {
      const whoisData = data[Object.keys(data)[0]];
      const domainWhoisData: DomainWhoisData = {
        domainStatus: whoisData['Domain Status'],
        nameServer: whoisData['Name Server'],
        domainName: whoisData['Domain Name'],
        registar: whoisData['Registrar'],
        registarWHOISServer: whoisData['Registrar WHOIS Server'],
        registarURL: whoisData['Registrar URL'],
        createdDate: whoisData['Updated Date'],
        updatedDate: whoisData['Created Date'],
        expiryDate: whoisData['Expiry Date'],
        raw: whoisData,
      };
      return NextResponse.json(domainWhoisData);
    } else {
      return NextResponse.json({});
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
