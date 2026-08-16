import { txByHash } from "../lib/api";
import { Panel, useAsync } from "../components/Ui";

export function Tx({ hash }: { hash: string }) {
  const tx = useAsync(() => txByHash(hash), [hash]);
  const data = tx.data?.tx_response;

  return (
    <>
      <h1>Transaction</h1>
      <p className="sub mono">{hash}</p>
      <Panel error={tx.error} loading={tx.loading}>
        {data && (
          <>
            <div className="kv">
              <div>
                <span className="k">Result</span>
                <span className="v">
                  <span className={`badge ${data.code === 0 ? "ok" : "fail"}`}>
                    {data.code === 0 ? "success" : `failed (code ${data.code})`}
                  </span>
                </span>
              </div>
              <div>
                <span className="k">Block</span>
                <span className="v">
                  <a href={`#/block/${data.height}`}>{data.height}</a>
                </span>
              </div>
              <div>
                <span className="k">Time</span>
                <span className="v">{new Date(data.timestamp).toLocaleString()}</span>
              </div>
              <div>
                <span className="k">Gas</span>
                <span className="v">
                  {data.gas_used} / {data.gas_wanted}
                </span>
              </div>
              {data.code !== 0 && (
                <div>
                  <span className="k">Error</span>
                  <span className="v">{data.raw_log}</span>
                </div>
              )}
            </div>

            <h2>Messages</h2>
            <pre className="kv mono" style={{ padding: 14, overflowX: "auto" }}>
              {JSON.stringify(data.tx, null, 2)}
            </pre>
          </>
        )}
      </Panel>
    </>
  );
}
