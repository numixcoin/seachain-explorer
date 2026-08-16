import { blockAt, txsAtHeight } from "../lib/api";
import { shortHash } from "../lib/format";
import { Panel, useAsync } from "../components/Ui";

export function Block({ height }: { height: string }) {
  const block = useAsync(() => blockAt(height), [height]);
  const txs = useAsync(() => txsAtHeight(height), [height]);

  return (
    <>
      <h1>Block {height}</h1>
      <Panel error={block.error} loading={block.loading}>
        {block.data && (
          <div className="kv">
            <div>
              <span className="k">Hash</span>
              <span className="v mono">{block.data.block_id.hash}</span>
            </div>
            <div>
              <span className="k">Time</span>
              <span className="v">{new Date(block.data.block.header.time).toLocaleString()}</span>
            </div>
            <div>
              <span className="k">Proposer</span>
              <span className="v mono">{block.data.block.header.proposer_address}</span>
            </div>
            <div>
              <span className="k">Transactions</span>
              <span className="v">{block.data.block.data.txs.length}</span>
            </div>
            <div>
              <span className="k">Navigate</span>
              <span className="v">
                <a href={`#/block/${Number(height) - 1}`}>← previous</a>{" "}
                <a href={`#/block/${Number(height) + 1}`}>next →</a>
              </span>
            </div>
          </div>
        )}
      </Panel>

      <h2>Transactions</h2>
      <Panel error={txs.error} loading={txs.loading}>
        {txs.data?.tx_responses?.length ? (
          <table>
            <thead>
              <tr>
                <th>Hash</th>
                <th>Result</th>
                <th>Gas used</th>
              </tr>
            </thead>
            <tbody>
              {txs.data.tx_responses.map((t) => (
                <tr key={t.txhash}>
                  <td>
                    <a className="mono" href={`#/tx/${t.txhash}`}>
                      {shortHash(t.txhash)}
                    </a>
                  </td>
                  <td>
                    <span className={`badge ${t.code === 0 ? "ok" : "fail"}`}>
                      {t.code === 0 ? "success" : `failed (${t.code})`}
                    </span>
                  </td>
                  <td>{t.gas_used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No transactions in this block.</p>
        )}
      </Panel>
    </>
  );
}
