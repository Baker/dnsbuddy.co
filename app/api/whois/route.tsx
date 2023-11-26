// TODO: Fix the checks
// @ts-nocheck
import whoiser from 'whoiser';
import { NextResponse } from 'next/server';
import { DomainWhoisData, IPWhoisData } from '@/lib/types/whois';

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
      const contactRouting = {
        OrgRoutingHandle: data['OrgRoutingHandle'],
        OrgRoutingName: data['OrgRoutingName'],
        OrgRoutingPhone: data['OrgRoutingPhone'],
        OrgRoutingEmail: data['OrgRoutingEmail'],
        OrgRoutingRef: data['OrgRoutingRef'],
      };

      const contactDNS = {
        OrgDNSHandle: data['OrgDNSHandle'],
        OrgDNSName: data['OrgDNSName'],
        OrgDNSPhone: data['OrgDNSPhone'],
        OrgDNSEmail: data['OrgDNSEmail'],
        OrgDNSRef: data['OrgDNSRef'],
      };
      const ipWhoisData: IPWhoisData = {
        range: data['range'],
        route: data['route'],
        NetName: data['NetName'],
        Parent: data['Parent'],
        asn: data['asn'],
        Organization: data['Organization'],
        RegDate: data['RegDate'],
        Updated: data['Updated'],
        Ref: data['Ref'],
        ResourceLink: data['ResourceLink'],
        ReferralServer: data['ReferralServer'],
        organisation: data['organisation'],
        contactNoc: data['contactNoc'],
        contactAbuse: data['contactAbuse'],
        contactTechnical: data['contactTechnical'],
        contactRouting: contactRouting,
        contactDNS: contactDNS,
        text: data['text'],
      };
      return NextResponse.json(ipWhoisData);
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
