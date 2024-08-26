
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
