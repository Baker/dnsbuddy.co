import type { ResponseItem } from "@/lib/types/dns";
import type {
  ASNWhoisData,
  DomainWhoisData,
  IPWhoisData,
} from "@/lib/types/whois";

export const exampleDNSResponseItem: ResponseItem = {
  // This is a single api call mock for example.com
  success: true,
  data: {
    Status: 0,
    TC: false,
    RD: true,
    RA: true,
    AD: true,
    CD: false,
    Question: [{ name: "example.com", type: 16 }],
    Answer: [
      { name: "example1.com", type: 16, TTL: 86400, data: '"v=spf1 -all"' },
      {
        name: "exampl1e.com",
        type: 16,
        TTL: 86400,
        data: '"wgyf8z8cgvm2qmxpnbnldrcltvk4xqfn"',
      },
    ],
  },
};

export const exampleDomainWhoisResponse: DomainWhoisData = {
  domainStatus: [
    "clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited",
    "clientTransferProhibited https://icann.org/epp#clientTransferProhibited",
    "clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited",
  ],
  nameServer: ["A.IANA-SERVERS.NET", "B.IANA-SERVERS.NET"],
  domainName: "EXAMPLE.COM",
  registar: "RESERVED-Internet Assigned Numbers Authority",
  registarWHOISServer: "whois.iana.org",
  registarURL: "http://res-dom.iana.org",
  createdDate: "2023-08-14T07:01:38Z",
  updatedDate: "1995-08-14T04:00:00Z",
  expiryDate: "2024-08-13T04:00:00Z",
};

export const exampleIpAddressV4WhoisResponse: IPWhoisData = {
  range: "133.13.31.0 - 133.13.31.255",
  route: "133.13.31.0/23",
  NetName: "MS-111",
  Parent: "NET133 (NET-133-0-0-0-0)",
  asn: "AS1",
  Organization: "Example (MS-111)",
  RegDate: "2020-01-17",
  Updated: "2021-12-14",
  Ref: "https://rdap.arin.net/registry/ip/133.13.31.23",
  organisation: {
    OrgName: "Example",
    OrgId: "MS-820",
    Address: "123 Main st",
    City: "Columbia",
    StateProv: "MD",
    PostalCode: "21046",
    Country: "US",
    RegDate: "2015-12-09",
    Updated: "2023-01-24",
    Ref: "https://rdap.arin.net/registry/entity/MS-111",
  },
  text: ["This is an example response."],
};

export const exampleIpAddressV6WhoisResponse: IPWhoisData = {
  range: "2001:: - 2001:1FF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF",
  route: "2001::/23",
  NetName: "IANA-V6-RESERVE",
  Parent: "NET2001 (NET-2001)",
  asn: "AS1",
  Organization: "Example (MS-111)",
  RegDate: "2020-01-17",
  Updated: "2021-12-14",
  Ref: "https://rdap.arin.net/registry/ip/2001:1FF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF",
  organisation: {
    OrgName: "Example",
    OrgId: "MS-820",
    Address: "123 Main st",
    City: "Columbia",
    StateProv: "MD",
    PostalCode: "21046",
    Country: "US",
    RegDate: "2015-12-09",
    Updated: "2023-01-24",
    Ref: "https://rdap.arin.net/registry/entity/MS-111",
  },
  text: ["This is an example response."],
};

export const exampleASNWhoisResponse: ASNWhoisData = {
  Number: "111",
  Name: "Example",
  Handle: "AS111",
  RegDate: "2018-04-16",
  Updated: "2018-04-16",
  Ref: "https://rdap.arin.net/registry/autnum/23528",
  organisation: {
    OrgName: "Example",
    OrgId: "MS-820",
    Address: "123 Main st",
    City: "Columbia",
    StateProv: "MD",
    PostalCode: "21046",
    Country: "US",
    RegDate: "2015-12-09",
    Updated: "2023-01-24",
    Ref: "https://rdap.arin.net/registry/entity/MS-111",
  },
  text: ["This is an example response."],
};
