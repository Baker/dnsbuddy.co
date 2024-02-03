
# ![DnsBuddy](/public/icon.png =32x32) DnsBuddy

[![CI](https://github.com/Baker/dnsbuddy.co/actions/workflows/ci.yml/badge.svg)](https://github.com/Baker/dnsbuddy.co/actions/workflows/ci.yml)

This is an open sourced website that you can use to pull up various DNS related records. This tool takes advantage of various DOH APIs (DNS over HTTPS), so thank you to those who run those (Google, Cloudflare, etc.)

## Built with

- [Next JS](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com)
- [React Hook Form](https://www.react-hook-form.com/)

## Development

Below is the guide on how to setup your local envirnoment.

### Prerequisites

We _assume_ you already have these installed.

- [Node.js](https://nodejs.org/en) - We expect you to running at least Node 18.17. (_If you have `nvm` installed, just do `nvm use`_)
- [pnpm](https://pnpm.io/) - You could probably use `npm` or `yarn`, we just prefer `pnpm`.

### Setup

1. Install the required packages: `pnpm i`
2. Run the local webserver: `pnpm run dev`

### Testing

Below are the two primary commands to run for tests:

1. `pnpm run test:e2e`: Which will run the tests across the various browsers. _If you are lacking the packages for this it will ask you to install the dependencies._
2. `pnpm run test:ui`: Which I personally use more when I am running tests, it gives you the UI so you can see and verify everything is working as expected.

## CI

As of right now we only use a few things to keep this repo formatted nicely, etc.

- [Playwright](https://playwright.dev/) - E2E Tests.
- [BiomeJS](https://biomejs.dev/) - Linter & Code Formatter.

The above is all handled by our CI, Github actions.
