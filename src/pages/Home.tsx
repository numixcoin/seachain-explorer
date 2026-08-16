import { blockAt, inflation, latestBlock, stakingPool, supply, validators } from "../lib/api";
import { formatAmount, shortHash, timeAgo } from "../lib/format";
import { Panel, useAsync } from "../components/Ui";
import { config } from "../config";

export function Home() {
  const latest = useAsync(latestBlock, [], 5000);
  const stats = useAsync(
    async () => {
      const [s, pool, infl, vals] = await Promise.all([
        supply(),
        stakingPool(),
        inflation(),
        validators(),
      ]);
      return { s, pool, infl, vals };
    },
    [],
    15000,
  );

  const height = Number(latest.data?.block.header.height ?? 0);
  const recent = useAsync(
    async () => {
      if (!height) return [];
      const heights = [];
      for (let h = height; h > Math.max(0, height - 10); h--) heights.push(h);
      return Promise.all(heights.map((h) => blockAt(h)));
    },
    [Math.floor(height / 5)],
  );

  const seaSupply = stats.data?.s.supply.find((c) => c.denom === config.baseDenom);
  const active = stats.data?.vals.validators.filter((v) => v.status === "BOND_STATUS_BONDED").length;

  return (
    <>
      <h1>SEACHAIN explorer</h1>
      <p className="sub">
        Chain <code className="mono">{config.chainId}</code> · native coin SEA COIN (SEA)
      </p>

      <div className="cards">
        <div className="card">
          <div className="label">Height</div>
          <div className="value">{height ? height.toLocaleString() : "—"}</div>
        </div>
        <div className="card">
          <div className="label">SEA supply</div>
          <div className="value">
            {seaSupply ? formatAmount(seaSupply.amount, seaSupply.denom) : "—"}
          </div>
        </div>
        <div className="card">
          <div className="label">Bonded</div>
          <div className="value">
            {stats.data ? formatAmount(stats.data.pool.pool.bonded_tokens, config.baseDenom) : "—"}
          </div>
        </div>
        <div className="card">
          <div className="label">Active validators</div>
          <div className="value">{active ?? "—"}</div>
        </div>
        <div className="card">
          <div className="label">Inflation</div>
          <div className="value">
            {stats.data ? `${(Number(stats.data.infl.inflation) * 100).toFixed(2)}%` : "—"}
          </div>
        </div>
      </div>

      <h2>Latest blocks</h2>
      <Panel error={latest.error ?? recent.error} loading={recent.loading}>
        <table>
          <thead>
            <tr>
              <th>Height</th>
              <th>Hash</th>
              <th>Txs</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {(recent.data ?? []).map((b) => (
              <tr key={b.block.header.height}>
                <td>
                  <a href={`#/block/${b.block.header.height}`}>{b.block.header.height}</a>
                </td>
                <td className="mono">{shortHash(b.block_id.hash)}</td>
                <td>{b.block.data.txs.length}</td>
                <td className="muted">{timeAgo(b.block.header.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
