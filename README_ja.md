# Nuxt JPTube FrontEnd Starter
[![GitHub stars](https://img.shields.io/github/stars/woak973/JPTube)](https://github.com/woak973/JPTube/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/woak973/JPTube)](https://github.com/woak973/JPTube/network)
[![GitHub issues](https://img.shields.io/github/issues/woak973/JPTube)](https://github.com/woak973/JPTube/issues)
[![GitHub license](https://img.shields.io/github/license/woak973/JPTube)](https://github.com/woak973/JPTube/blob/master/LICENSE)
[![Last updated](https://img.shields.io/github/last-commit/woak973/JPTube)](https://github.com/woak973/JPTube/commits/master)

詳細については、[Nuxt documentation](https://nuxt.com/docs/getting-started/introduction)をご覧ください。

## JPTubeについて
![JPTube UI](https://github.com/user-attachments/assets/42e33aae-992c-4dae-8067-ce707310d57b)
JPTubeはYouTubeの代替フロントエンドです。[LuanRT/YouTube.js](https://github.com/LuanRT/YouTube.js)を使用して情報を取得します。JPTubeはNuxtとVuetifyを使用して構築されています。

### バックエンド

JPTubeを動作させるにはバックエンドが必要です。[JPTube-server](https://github.com/woak973/JPTube-server)からバックエンドをデプロイできます。

### 環境変数

以下の環境変数を設定できます:

- `BACKEND_HOST`: 動画ストリーミング以外の情報を取得するために使用するバックエンドサーバーを指定します。
- `PLAYER_BACKEND_HOST`: 動画ストリーミング情報、及びダウンロード時の情報を取得するために使用するバックエンドサーバーを指定します。
- `LOGIN_PASSWORD`: アクセス用のパスワードを指定します。

デプロイ時に`BACKEND_HOST`および`PLAYER_BACKEND_HOST`環境変数が設定されていない場合、woak973がホストする公式バックエンドがデフォルトのバックエンドとして使用されます。また、`LOGIN_PASSWORD`環境変数が設定されていない場合、デフォルトのパスワード`20531`が使用されます。

## Setup JPTube

依存関係をインストールする:

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

開発サーバーを`http://localhost:3000`で起動する:

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

## 本番環境

本番環境用にアプリケーションをビルドする:

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

本番ビルドをローカルでプレビューする:

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

詳細については、[deployment documentation](https://nuxt.com/docs/getting-started/deployment)をご覧ください。

## JPTubeのデプロイ
### 推奨
[バックエンド](https://github.com/woak973/JPTube-Server)と同時にデプロイされます。

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/woak973/JPTube)

### その他のサービス
これらのサービスを使用する場合、バックエンドを別途デプロイし、環境変数で設定する必要があります。

[![Deploy to Vercel](https://binbashbanana.github.io/deploy-buttons/buttons/official/vercel.svg)](https://vercel.com/new/clone?repository-url=https://github.com/woak973/JPTube)
[![Deploy to Netlify](https://binbashbanana.github.io/deploy-buttons/buttons/official/netlify.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/woak973/JPTube)
[![Deploy to Koyeb](https://binbashbanana.github.io/deploy-buttons/buttons/official/koyeb.svg)](https://app.koyeb.com/deploy?type=git&repository=github.com/woak973/JPTube&branch=master&name=jptube)
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/woak973/JPTube)
[![Deploy to Heroku](https://binbashbanana.github.io/deploy-buttons/buttons/official/heroku.svg)](https://heroku.com/deploy/?template=https://github.com/woak973/JPTube)
[![Run on Google Cloud](https://binbashbanana.github.io/deploy-buttons/buttons/official/googlecloud.svg)](https://deploy.cloud.run/?git_repo=https://github.com/woak973/JPTube)
[![Deploy to Amplify Console](https://binbashbanana.github.io/deploy-buttons/buttons/remade/amplifyconsole.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/woak973/JPTube)
