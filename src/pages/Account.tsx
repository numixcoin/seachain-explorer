import { balances, nftsOfOwner, txsForAddress } from "../lib/api";
import { formatAmount, shortHash } from "../lib/format";
import { Panel, useAsync } from "../components/Ui";
import { config } from "../config";

export function Account({ address }: { address: string }) {
  const data = useAsync(
    async () => {
      const [bal, nfts] = await Promise.all([balances(address), nftsOfOwner(address)]);
      let txs: Awaited<ReturnType<typeof txsForAddress>> | null = null;
      try {
        txs = await txsForAddress(address);
      } catch {
        txs = null;
      }
      return { bal, nfts, txs };
    },
    [address],
    10000,
  );

  return (
    <>
      <h1>Account</h1>
      <p className="sub mono">{address}</p>
      <p>
        <a href={`${config.walletUrl}/#/send?to=${address}`}>Send SEA to this address →</a>
      </p>

      <Panel error={data.error} loading={data.loading}>
        <h2>Balances</h2>
        {data.data?.bal.balances.length ? (
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Amount</th>
                <th>Denom</th>
              </tr>
            </thead>
            <tbody>
              {data.data.bal.balances.map((c) => (
                <tr key={c.denom}>
                  <td>{c.denom === config.baseDenom ? "SEA COIN" : "Factory token"}</td>
                  <td>{formatAmount(c.amount, c.denom)}</td>
                  <td className="mono">{c.denom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No balances.</p>
        )}

        <h2>NFTs</h2>
        {data.data?.nfts.nfts.length ? (
          <table>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Token</th>
                <th>URI</th>
              </tr>
            </thead>
            <tbody>
              {data.data.nfts.nfts.map((n) => (
                <tr key={`${n.class_id}/${n.id}`}>
                  <td>
                    <a href={`#/nfts/${n.class_id}`}>{n.class_id}</a>
                  </td>
                  <td className="mono">{n.id}</td>
                  <td className="mono">{n.uri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No NFTs.</p>
        )}

        <h2>Recent transactions</h2>
        {data.data?.txs?.tx_responses?.length ? (
          <table>
            <thead>
              <tr>
                <th>Hash</th>
                <th>Height</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {data.data.txs.tx_responses.map((t) => (
                <tr key={t.txhash}>
                  <td>
                    <a className="mono" href={`#/tx/${t.txhash}`}>
                      {shortHash(t.txhash)}
                    </a>
                  </td>
                  <td>
                    <a href={`#/block/${t.height}`}>{t.height}</a>
                  </td>
                  <td>
                    <span className={`badge ${t.code === 0 ? "ok" : "fail"}`}>
                      {t.code === 0 ? "success" : "failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No indexed transactions sent from this address.</p>
        )}
      </Panel>
    </>
  );
}
