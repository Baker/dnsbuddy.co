
![logo](/public/android-chrome-192x192.png)

# DnsBuddy - An opensourced DNS Swiss Army Knife

[![CI](https://github.com/Baker/dnsbuddy.co/actions/workflows/ci.yml/badge.svg)](https://github.com/Baker/dnsbuddy.co/actions/workflows/ci.yml)

I am happy to announce version 2.0, originally the goal of this project was to use DOH. I have since moved away from that and decided to focus on the DNS side of things, with speed and reliability being at the forefront.

Since 1.0, I have changed the entire backend to Go, this is to ensure that the service is fast and reliable. The frontend is still using Next.JS

## Stack


## Features

- Lookup various DNS records (A, AAAA, NS, MX, SOA, SRV, PTR, TXT, CNAME).
- Lookup WHOIS information for domains, IPs and ASNs.
- Bulk lookup of DNS records across multiple providers.
- Find subdomains for a given domain. (This is still a WIP - not the most efficient, but it works)
- Breakdown the different types of mechanisms being in a domains SPF.

## Backend

The backend is a Go application that is designed to be fast and reliable. It is built using the Gin framework and the dnsx library.

### DNS Providers

The following DNS providers are currently supported:

- Cloudflare
- Google
- Alibaba
- Quad9
- DNSFilter
- OpenDNS
- DynDNS
- CenturyLink
- Yandex

Eventually I will expend this to pull in more Geolocated providers.

### Net vs DNSX

I have used the `DNSX` package before this, and during the original development of this project I did run some tests against both `DNSX` and `Net` to see which one was faster.

Both seem to be pretty similar, I chose to go with `DNSX` because it has more features and is more configurable. I can set automatic retries, and it was a lot easier to support different record types.

I may come back to this and do some more testing, but for now I am happy with the current implementation.

