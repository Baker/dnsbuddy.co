export const ProviderToUrlMapping = {
  cloudflare: "https://cloudflare-dns.com/dns-query",
  google: "https://dns.google/resolve",
  quad9: "https://dns.quad9.net:5053/dns-query",
  alibaba: "https://dns.alidns.com/resolve",
  chicago: "https://us-chi.doh.sb/dns-query",
  new_york: "https://us-nyc.doh.sb/dns-query",
  san_jose: "https://us-sjc.doh.sb/dns-query",
  frankfurt: "https://de-fra.doh.sb/dns-query",
  hong_kong: "https://hk-hkg.doh.sb/dns-query",
};

export const ProviderToLabelMapping = {
  cloudflare: "Cloudflare",
  google: "Google",
  quad9: "Quad9",
  alibaba: "Alibaba",
  chicago: "Chicago, US",
  new_york: "New York, US",
  san_jose: "San Jose, US",
  frankfurt: "Frankfurt, DE",
  hong_kong: "Hong Kong, CN",
};

export const WhoIsTypes = {
  IP_ADDRESS: "IP Address",
  DOMAIN: "Domain",
  ASN: "ASN",
};
