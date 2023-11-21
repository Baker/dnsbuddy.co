interface Organisation {
  OrgName: string;
  OrgId: string;
  Address: string;
  City: string;
  StateProv: string;
  PostalCode: string;
  Country: string;
  RegDate: string;
  Updated: string;
  Ref: string;
}

interface Technical {
  OrgTechHandle: string;
  OrgTechName: string;
  OrgTechPhone: string;
  OrgTechEmail: string;
  OrgTechRef: string;
}

interface Abuse {
  OrgAbuseHandle: string;
  OrgAbuseName: string;
  OrgAbusePhone: string;
  OrgAbuseEmail: string;
  OrgAbuseRef: string;
}

export interface ASNWhoIsData {
  ASNumber: string;
  ASName: string;
  ASHandle: string;
  RegDate: string;
  Updated: string;
  Comment: string;
  Ref: string;
  ResourceLink: string;
  organisation: Organisation;
  ReferralServer: string;
  contactTechnical: Technical;
  contactAbuse: Abuse;
  text: string[];
}

export interface IPWhoisData {
  range: string;
  route: string;
  NetName: string;
  NetHandle: string;
  Parent: string;
  NetType: string;
  asn: string;
  Organization: string;
  RegDate: string;
  Updated: string;
  Comment: string;
  Ref: string;
  ResourceLink: string;
  organisation: Organisation;
  ReferralServer: string;
  contactTechnical: Technical;
  contactAbuse: Abuse;
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
