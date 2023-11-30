interface organisation {
  OrgName: string;
  OrgId: string;
  Address: string;
  City: string;
  StateProv: string;
  PostalCode: string;
  Country: string;
  RegDate: string;
  Updated: string;
  Comment?: string;
  Ref: string;
}

interface contact {
  Handle: string;
  Name: string;
  Phone: string;
  Email: string;
  Ref: string;
}

export interface IPWhoisData {
  range: string;
  route: string;
  NetName: string;
  NetType?: string;
  Parent: string;
  asn: string;
  Organization: string;
  RegDate: string;
  Updated: string;
  Ref: string;
  ResourceLink?: string;
  ReferralServer?: string;
  organisation: organisation;
  contactNoc?: contact;
  contactAbuse?: contact;
  contactTechnical?: contact;
  contactRouting?: contact;
  contactDNS?: contact;
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
}
