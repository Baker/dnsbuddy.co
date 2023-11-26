interface organisation {
  OrgName: string;
  OrgId: string;
  Address: string;
  City: string;
  StateProv: string;
  Country: string;
  RegDate: string;
  Updated: string;
  Comment?: string;
  Ref: string;
}

interface noc {
  OrgNOCHandle: string;
  OrgNOCName: string;
  OrgNOCPhone: string;
  OrgNOCEmail: string;
  OrgNOCRef: string;
}

interface abuse {
  OrgAbuseHandle: string;
  OrgAbuseName: string;
  OrgAbusePhone: string;
  OrgAbuseEmail: string;
  OrgAbuseRef: string;
}

interface technical {
  OrgTechHandle: string;
  OrgTechName: string;
  OrgTechPhone: string;
  OrgTechEmail: string;
  OrgTechRef: string;
}

interface routing {
  OrgRoutingHandle: string;
  OrgRoutingName: string;
  OrgRoutingPhone: string;
  OrgRoutingEmail: string;
  OrgRoutingRef: string;
}

interface dns {
  OrgDNSHandle: string;
  OrgDNSName: string;
  OrgDNSPhone: string;
  OrgDNSEmail: string;
  OrgDNSRef: string;
}

export interface IPWhoisData {
  range: string;
  route: string;
  NetName: string;
  NetType: string;
  Parent: string;
  asn: string;
  Organization: string;
  RegDate: string;
  Updated: string;
  Ref: string;
  ResourceLink?: string;
  ReferralServer?: string;
  organisation: organisation;
  contactNoc?: noc;
  contactAbuse?: abuse;
  contactTechnical?: technical;
  contactRouting: routing;
  contactDNS: dns;
  text: string[];
}

export interface DomainWhoisData {
  domainStatus: string[];
  nameServer: string[];
  domainName: string;
  registar: string;
  registarWHOISServer: string;
  registarURL: string;
  createdDate: string;
  updatedDate: string;
  expiryDate: string;
  raw: string[];
}
