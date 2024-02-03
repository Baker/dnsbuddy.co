// @ts-nocheck
import { WhoIsTypes } from "@/types/whois";
import type { DomainWhoisData, IPWhoisData } from "@/types/whois";
import { NextResponse } from "next/server";
// TODO: Fix the checks
// @ts-nocheck
import whoiser from "whoiser";

export async function POST(request: Request) {
  try {
    const { query, type } = await request.json();
    const data = await whoiser(query, { follow: 1 });
    // This means it was a domain lookup.
    if (WhoIsTypes[type] === WhoIsTypes.DOMAIN) {
      const whoisData = data[Object.keys(data)[0]];
      const domainWhoisData: DomainWhoisData = {
        domainStatus: whoisData["Domain Status"],
        nameServer: whoisData["Name Server"],
        domainName: whoisData["Domain Name"],
        registar: whoisData.Registrar,
        registarWHOISServer: whoisData["Registrar WHOIS Server"],
        registarURL: whoisData["Registrar URL"],
        createdDate: whoisData["Updated Date"],
        updatedDate: whoisData["Created Date"],
        expiryDate: whoisData["Expiry Date"],
      };
      return NextResponse.json(domainWhoisData);
    }
    if (WhoIsTypes[type] === WhoIsTypes.IP) {
      return NextResponse.json(parseIp(data));
    }
    if (WhoIsTypes[type] === WhoIsTypes.ASN) {
      return NextResponse.json(parseAsn(data));
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

function createContactObject(data, prefix) {
  if (data[`contact${prefix}`]) {
    // Handle the different prefixes and the key value differences.
    const key =
      prefix === "Technical" ? "Tech" : prefix === "Noc" ? "NOC" : prefix;
    const newData = data[`contact${prefix}`];
    return {
      Handle: newData[`Org${key}Handle`] || newData[`R${key}Handle`],
      Name: newData[`Org${key}Name`] || newData[`R${key}Name`],
      Phone: newData[`Org${key}Phone`] || newData[`R${key}Phone`],
      Email: newData[`Org${key}Email`] || newData[`R${key}Email`],
      Ref: newData[`Org${key}Ref`] || newData[`R${key}Ref`],
    };
  }
  return {
    Handle: data[`Org${prefix}Handle`] || data[`R${prefix}Handle`],
    Name: data[`Org${prefix}Name`] || data[`R${prefix}Name`],
    Phone: data[`Org${prefix}Phone`] || data[`R${prefix}Phone`],
    Email: data[`Org${prefix}Email`] || data[`R${prefix}Email`],
    Ref: data[`Org${prefix}Ref`] || data[`R${prefix}Ref`],
  };
}

function parseIp(data) {
  const contactAbuse = createContactObject(data, "Abuse");
  const contactNoc = createContactObject(data, "Noc");
  const contactTechnical = createContactObject(data, "Technical");
  const contactRouting = createContactObject(data, "Routing");
  const contactDNS = createContactObject(data, "DNS");

  const ipWhoisData: IPWhoisData = {
    range: data.range,
    route: data.route,
    NetName: data.NetName,
    Parent: data.Parent,
    asn: data.asn,
    Organization: data.Organization,
    RegDate: data.RegDate,
    Updated: data.Updated,
    Ref: data.Ref,
    ResourceLink: data.ResourceLink,
    ReferralServer: data.ReferralServer,
    organisation: data.organisation,
    contactNoc: contactNoc,
    contactAbuse: contactAbuse,
    contactTechnical: contactTechnical,
    contactRouting: contactRouting,
    contactDNS: contactDNS,
    text: data.text,
  };
  return ipWhoisData;
}

function parseAsn(data) {
  const contactAbuse = createContactObject(data, "Abuse");
  const contactNoc = createContactObject(data, "Noc");
  const contactTechnical = createContactObject(data, "Technical");
  const contactRouting = createContactObject(data, "Routing");
  const contactDNS = createContactObject(data, "DNS");

  const asnData = {
    Number: data.ASNumber,
    Name: data.ASName,
    Handle: data.ASHandle,
    RegDate: data.RegDate,
    Updated: data.Updated,
    Ref: data.Ref,
    organisation: data.organisation,
    contactNoc: contactNoc,
    contactAbuse: contactAbuse,
    contactTechnical: contactTechnical,
    contactRouting: contactRouting,
    contactDNS: contactDNS,
    text: data.text,
  };
  return asnData;
}
