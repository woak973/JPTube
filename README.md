# Nuxt JPTube FrontEnd Starter
[![GitHub stars](https://img.shields.io/github/stars/woak973/JPTube)](https://github.com/woak973/JPTube/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/woak973/JPTube)](https://github.com/woak973/JPTube/network)
[![GitHub issues](https://img.shields.io/github/issues/woak973/JPTube)](https://github.com/woak973/JPTube/issues)


Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## About JPTube
JPTube is an alternative frontend for YouTube. It uses [LuanRT/YouTube.js](https://github.com/LuanRT/YouTube.js) to retrieve information. JPTube is built using Nuxt and Vuetify.

## Backend

You can deploy the backend from [JPTube-server](https://github.com/woak973/JPTube-server).

## Environment Variables

You can configure the following environment variables:

- `BACKEND_HOST`: The host of the backend server.
- `PASSWORD`: The password for accessing.

When deploying, if the `BACKEND_HOST` environment variable is not set, the default backend hosted by woak973 will be used.

## Setup JPTube

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Deploy JPTube
### Recommended
Deploy simultaneously with the [backend](https://github.com/woak973/JPTube-Server)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/woak973/JPTube)

### Other Services

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/woak973/JPTube)
[![Deploy to Heroku](https://binbashbanana.github.io/deploy-buttons/buttons/official/heroku.svg)](https://heroku.com/deploy/?template=https://github.com/woak973/JPTube)
[![Run on Google Cloud](https://binbashbanana.github.io/deploy-buttons/buttons/official/googlecloud.svg)](https://deploy.cloud.run/?git_repo=https://github.com/woak973/JPTube)
[![Deploy to Amplify Console](https://binbashbanana.github.io/deploy-buttons/buttons/remade/amplifyconsole.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/woak973/JPTube)

