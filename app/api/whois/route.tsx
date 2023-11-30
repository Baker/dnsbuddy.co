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
      };
      return NextResponse.json(domainWhoisData);
    } else {
      let contactAbuse;
      if (data['contactAbuse']) {
        contactAbuse = {
          Handle:
            data['contactAbuse']['OrgAbuseHandle'] ||
            data['contactAbuse']['RAbuseHandle'],
          Name:
            data['contactAbuse']['OrgAbuseName'] ||
            data['contactAbuse']['RAbuseName'],
          Phone:
            data['contactAbuse']['OrgAbusePhone'] ||
            data['contactAbuse']['RAbusePhone'],
          Email:
            data['contactAbuse']['OrgAbuseEmail'] ||
            data['contactAbuse']['RAbuseEmail'],
          Ref:
            data['contactAbuse']['OrgAbuseRef'] ||
            data['contactAbuse']['RAbuseRef'],
        };
      }
      let contactNoc;
      if (data['contactNoc']) {
        contactNoc = {
          Handle:
            data['contactNoc']['OrgNOCHandle'] ||
            data['contactNoc']['RNOCHandle'],
          Name:
            data['contactNoc']['OrgNOCName'] || data['contactNoc']['RNOCName'],
          Phone:
            data['contactNoc']['OrgNOCPhone'] ||
            data['contactNoc']['RNOCPhone'],
          Email:
            data['contactNoc']['OrgNOCEmail'] ||
            data['contactNoc']['RNOCEmail'],
          Ref: data['contactNoc']['OrgNOCRef'] || data['contactNoc']['RNOCRef'],
        };
      }
      let contactTechnical;
      if (data['contactTechnical']) {
        contactTechnical = {
          Handle:
            data['contactTechnical']['OrgTechHandle'] ||
            data['contactTechnical']['RTechHandle'],
          Name:
            data['contactTechnical']['OrgTechName'] ||
            data['contactTechnical']['RTechName'],
          Phone:
            data['contactTechnical']['OrgTechPhone'] ||
            data['contactTechnical']['RTechPhone'],
          Email:
            data['contactTechnical']['OrgTechEmail'] ||
            data['contactTechnical']['RTechEmail'],
          Ref:
            data['contactTechnical']['OrgTechRef'] ||
            data['contactTechnical']['RTechRef'],
        };
      }
      let contactRouting;
      if (data['contactRouting']) {
        contactRouting = {
          Handle: data['OrgRoutingHandle'] || data['RRoutingHandle'],
          Name: data['OrgRoutingName'] || data['RRoutingName'],
          Phone: data['OrgRoutingPhone'] || data['RRoutingPhone'],
          Email: data['OrgRoutingEmail'] || data['RRoutingEmail'],
          Ref: data['OrgRoutingRef'] || data['RRoutingRef'],
        };
      }
      let contactDNS;
      if (data['contactDNS']) {
        contactDNS = {
          Handle: data['OrgDNSHandle'] || data['RDNSHandle'],
          Name: data['OrgDNSName'] || data['RDNSName'],
          Phone: data['OrgDNSPhone'] || data['RDNSPhone'],
          Email: data['OrgDNSEmail'] || data['RDNSEmail'],
          Ref: data['OrgDNSRef'] || data['RDNSRef'],
        };
      }
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
        contactNoc: contactNoc,
        contactAbuse: contactAbuse,
        contactTechnical: contactTechnical,
        contactRouting: contactRouting,
        contactDNS: contactDNS,
        text: data['text'],
      };
      return NextResponse.json(ipWhoisData);
    }
  } catch (error) {
    throw new Error(error);
  }
}
