# Nuxt JPTube FrontEnd Starter
[![GitHub stars](https://img.shields.io/github/stars/woak973/JPTube)](https://github.com/woak973/JPTube/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/woak973/JPTube)](https://github.com/woak973/JPTube/network)
[![GitHub issues](https://img.shields.io/github/issues/woak973/JPTube)](https://github.com/woak973/JPTube/issues)
[![GitHub license](https://img.shields.io/github/license/woak973/JPTube)](https://github.com/woak973/JPTube/blob/master/LICENSE)
[![Last updated](https://img.shields.io/github/last-commit/woak973/JPTube)](https://github.com/woak973/JPTube/commits/master)


Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more about Nuxt.

## 日本語版README
日本語のREADMEは[こちら](README_ja.md)をご覧ください。

## About JPTube
![JPTube UI](https://raw.githubusercontent.com/woak973/JPTube/master/public/sample.png)
JPTube is an alternative frontend for YouTube. It uses [LuanRT/YouTube.js](https://github.com/LuanRT/YouTube.js) to retrieve information. JPTube is built using Nuxt3 and Vuetify.

### Backend

If your current IP is banned or restricted, JPTube can also use a backend to retrieve information. You can deploy the Deno backend from [JPTube-server](https://github.com/woak973/JPTube-server) and Node.js backend from [JPTube-server-node](https://github.com/woak973/JPTube-server-node).

### Environment Variables

You can configure the following environment variables:

- `BACKEND_HOST`: Specifies the backend server used to retrieve non-video-streaming information.
- `PLAYER_BACKEND_HOST`: Specifies the backend server used to retrieve video-streaming information.
- `COOKIE`: Specifies the cookie to retrieve information. For more details, see [here](https://github.com/patrickkfkan/Volumio-YouTube.js/wiki/How-to-obtain-Cookie).
- `LOGIN_PASSWORD`: Specifies the password for accessing.

When deploying, if the `BACKEND_HOST` and `PLAYER_BACKEND_HOST`environment variable is not set, the official backend hosted by woak973 will be used as the server's default backend. Additionally, if the `LOGIN_PASSWORD` environment variable is not set, the default password `20531` will be used.

### Troubleshooting

#### If you see "streaming data not available", "video is unplayable", or "video is login required"

The IP address of your current instance may be banned or restricted.  
Try logging in using a Cookie, or specify a backend to retrieve the information.

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

Look at the [Nuxt Deploy](https://nuxt.com/deploy) to learn more about Deploying NuxtApp.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/woak973/JPTube)
[![Deploy to Vercel](https://binbashbanana.github.io/deploy-buttons/buttons/official/vercel.svg)](https://vercel.com/new/clone?repository-url=https://github.com/woak973/JPTube)
[![Deploy to Netlify](https://binbashbanana.github.io/deploy-buttons/buttons/official/netlify.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/woak973/JPTube)
[![Deploy to Koyeb](https://binbashbanana.github.io/deploy-buttons/buttons/official/koyeb.svg)](https://app.koyeb.com/deploy?type=git&repository=github.com/woak973/JPTube&branch=master&name=jptube)
[![Run on Replit](https://binbashbanana.github.io/deploy-buttons/buttons/official/replit.svg)](https://replit.com/github/woak973/JPTube)
[![Deploy on Railway](https://binbashbanana.github.io/deploy-buttons/buttons/official/railway.svg)](https://railway.app/new/template?template=https://github.com/woak973/JPTube)
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/woak973/JPTube)
[![Deploy to Heroku](https://binbashbanana.github.io/deploy-buttons/buttons/official/heroku.svg)](https://heroku.com/deploy/?template=https://github.com/woak973/JPTube)
[![Run on Google Cloud](https://binbashbanana.github.io/deploy-buttons/buttons/official/googlecloud.svg)](https://deploy.cloud.run/?git_repo=https://github.com/woak973/JPTube)
[![Deploy to Amplify Console](https://binbashbanana.github.io/deploy-buttons/buttons/remade/amplifyconsole.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/woak973/JPTube)

You can also fork the repository yourself and deploy it to platforms such as [Deno Deploy](https://deno.com/deploy) and [Cloudflare Pages](https://pages.cloudflare.com/).

