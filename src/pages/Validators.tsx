import { validators } from "../lib/api";
import { formatAmount } from "../lib/format";
import { Panel, useAsync } from "../components/Ui";
import { config } from "../config";

export function Validators() {
  const data = useAsync(validators, [], 30000);
  const sorted = [...(data.data?.validators ?? [])].sort(
    (a, b) => Number(b.tokens) - Number(a.tokens),
  );

  return (
    <>
      <h1>Validators</h1>
      <Panel error={data.error} loading={data.loading}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Moniker</th>
              <th>Voting power</th>
              <th>Commission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((v, i) => (
              <tr key={v.operator_address}>
                <td>{i + 1}</td>
                <td>
                  {v.description.moniker}
                  <div className="mono muted" style={{ fontSize: 11 }}>
                    {v.operator_address}
                  </div>
                </td>
                <td>{formatAmount(v.tokens, config.baseDenom)}</td>
                <td>{(Number(v.commission.commission_rates.rate) * 100).toFixed(2)}%</td>
                <td>
                  <span className={`badge ${v.status === "BOND_STATUS_BONDED" && !v.jailed ? "ok" : "fail"}`}>
                    {v.jailed ? "jailed" : v.status.replace("BOND_STATUS_", "").toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
