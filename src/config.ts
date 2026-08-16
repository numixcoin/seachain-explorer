export const config = {
  chainId: import.meta.env.VITE_CHAIN_ID ?? "seachain-1",
  chainName: "SEACHAIN",
  rpc: import.meta.env.VITE_RPC ?? "https://rpc.seachain.xyz",
  rest: import.meta.env.VITE_REST ?? "https://api.seachain.xyz",
  baseDenom: "usea",
  displayDenom: "SEA",
  exponent: 6,
  addressPrefix: "sea",
  walletUrl: import.meta.env.VITE_WALLET_URL ?? "https://wallet.seachain.xyz",
};
