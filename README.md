# seachain-explorer

Block explorer for **SEACHAIN** (`seachain-1`) — https://explorer.seachain.xyz

It is a static React + TypeScript app that talks directly to the chain's public
REST (`/cosmos/...`, `/numixcoin/seachain/...`) and needs no database and no
indexer, so it can be hosted on GitHub Pages, Vercel, Netlify or any CDN.

Shows:

- chain overview: height, SEA supply, bonded stake, inflation, active validators
- latest blocks, block detail and the transactions inside a block
- transaction detail with success/failure code, gas and messages
- account page: SEA and factory token balances, owned NFTs, recent transactions
- validator set with voting power, commission and jail status
- every token created with the factory module, its supply and its admin
- every NFT collection, its creator, and the current owner of each NFT
- search by block height, `sea1…` address or transaction hash

## Run locally

```bash
npm install
cp .env.example .env      # point it at your node
npm run dev               # http://localhost:5173
```

Against a local node started with `seachain/scripts/localnet.sh`:

```bash
VITE_CHAIN_ID=seachain-local VITE_RPC=http://localhost:26657 VITE_REST=http://localhost:1317 npm run dev
```

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_CHAIN_ID` | `seachain-1` | chain id shown in the UI |
| `VITE_RPC` | `https://rpc.seachain.xyz` | CometBFT RPC endpoint |
| `VITE_REST` | `https://api.seachain.xyz` | Cosmos REST (LCD) endpoint |
| `VITE_WALLET_URL` | `https://wallet.seachain.xyz` | link to the web wallet |

The REST endpoint must send permissive CORS headers, since the browser calls it
directly. On the node set `enabled-unsafe-cors = true` in `app.toml`, or put a
reverse proxy in front of it that adds `Access-Control-Allow-Origin`.

## Deploy

```bash
npm run build      # static site in dist/
```

`.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub
Pages on every push to `main`; point the `explorer.seachain.xyz` CNAME at it.
