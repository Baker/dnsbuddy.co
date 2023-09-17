# 🌐 DnsBuddy

This is an open sourced website that you can use to pull up various DNS related records. This tool takes advantage of various DOH APIs (DNS over HTTPS), so thank you to those who run those (Google, Cloudflare, etc.)

## Goals

Let's talk about the goals of this site, I want to have this documented here that way it will hopefully provide some guidance around issue's or features offered.

- Allow the end user to easily look up records.
- Attempt to educate the end user about what the purpose of the record(s) are/is.
- Provide the end user with clear guidance around how to look up these records locally.

Here is the original Wireframe:![Whismical Wireframe of the original vision for this project.](https://i.imgur.com/KO1xPGo.png)

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


## Testing

