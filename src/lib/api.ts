import { config } from "../config";

async function get<T>(base: string, path: string): Promise<T> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return (await res.json()) as T;
}

export const rest = <T,>(path: string) => get<T>(config.rest, path);
export const rpc = <T,>(path: string) => get<T>(config.rpc, path);

export interface BlockHeader {
  height: string;
  time: string;
  proposer_address: string;
  chain_id: string;
}

export interface BlockResponse {
  block_id: { hash: string };
  block: { header: BlockHeader; data: { txs: string[] } };
}

export const latestBlock = () =>
  rest<BlockResponse>("/cosmos/base/tendermint/v1beta1/blocks/latest");

export const blockAt = (height: string | number) =>
  rest<BlockResponse>(`/cosmos/base/tendermint/v1beta1/blocks/${height}`);

export interface TxResponse {
  txhash: string;
  height: string;
  code: number;
  gas_used: string;
  gas_wanted: string;
  timestamp: string;
  raw_log: string;
  tx: unknown;
  events?: { type: string; attributes: { key: string; value: string }[] }[];
}

export const txByHash = (hash: string) =>
  rest<{ tx_response: TxResponse }>(`/cosmos/tx/v1beta1/txs/${hash}`);

export const txsAtHeight = (height: string) =>
  rest<{ tx_responses: TxResponse[] }>(
    `/cosmos/tx/v1beta1/txs?query=${encodeURIComponent(`tx.height=${height}`)}&limit=100`,
  );

export const txsForAddress = (address: string) =>
  rest<{ tx_responses: TxResponse[] }>(
    `/cosmos/tx/v1beta1/txs?query=${encodeURIComponent(
      `message.sender='${address}'`,
    )}&limit=25&order_by=ORDER_BY_DESC`,
  );

export interface Coin {
  denom: string;
  amount: string;
}

export const balances = (address: string) =>
  rest<{ balances: Coin[] }>(`/cosmos/bank/v1beta1/balances/${address}`);

export const supply = () => rest<{ supply: Coin[] }>("/cosmos/bank/v1beta1/supply?pagination.limit=500");

export const denomMetadata = () =>
  rest<{ metadatas: { base: string; display: string; name: string; symbol: string; description: string }[] }>(
    "/cosmos/bank/v1beta1/denoms_metadata?pagination.limit=500",
  );

export interface Validator {
  operator_address: string;
  description: { moniker: string; website: string; details: string };
  tokens: string;
  status: string;
  jailed: boolean;
  commission: { commission_rates: { rate: string } };
}

export const validators = () =>
  rest<{ validators: Validator[] }>(
    "/cosmos/staking/v1beta1/validators?pagination.limit=200",
  );

export const stakingPool = () =>
  rest<{ pool: { bonded_tokens: string; not_bonded_tokens: string } }>(
    "/cosmos/staking/v1beta1/pool",
  );

export const inflation = () => rest<{ inflation: string }>("/cosmos/mint/v1beta1/inflation");

export interface DenomAuth {
  denom: string;
  admin: string;
}

export const factoryDenoms = () =>
  rest<{ denomAuth: DenomAuth[] }>(
    "/numixcoin/seachain/factory/denom_auth?pagination.limit=500",
  );

export interface ClassOwner {
  classId: string;
  owner: string;
}

export const nftClassOwners = () =>
  rest<{ classOwner: ClassOwner[] }>(
    "/numixcoin/seachain/seanft/class_owner?pagination.limit=500",
  );

export interface NftClass {
  id: string;
  name: string;
  symbol: string;
  description: string;
  uri: string;
}

export const nftClasses = () =>
  rest<{ classes: NftClass[] }>("/cosmos/nft/v1beta1/classes?pagination.limit=500");

export interface Nft {
  class_id: string;
  id: string;
  uri: string;
  uri_hash: string;
}

export const nftsOfClass = (classId: string) =>
  rest<{ nfts: Nft[] }>(`/cosmos/nft/v1beta1/nfts?class_id=${classId}&pagination.limit=200`);

export const nftsOfOwner = (owner: string) =>
  rest<{ nfts: Nft[] }>(`/cosmos/nft/v1beta1/nfts?owner=${owner}&pagination.limit=200`);

export const nftOwner = (classId: string, id: string) =>
  rest<{ owner: string }>(`/cosmos/nft/v1beta1/owner/${classId}/${id}`);
