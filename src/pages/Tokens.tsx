import { denomMetadata, factoryDenoms, supply } from "../lib/api";
import { formatAmount } from "../lib/format";
import { Panel, useAsync } from "../components/Ui";

export function Tokens() {
  const data = useAsync(
    async () => {
      const [auth, meta, sup] = await Promise.all([factoryDenoms(), denomMetadata(), supply()]);
      return { auth, meta, sup };
    },
    [],
    20000,
  );

  return (
    <>
      <h1>Tokens</h1>
      <p className="sub">Every token created on SEACHAIN with the factory module.</p>
      <Panel error={data.error} loading={data.loading}>
        {data.data?.auth.denomAuth?.length ? (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Supply</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {data.data.auth.denomAuth.map((d) => {
                const meta = data.data?.meta.metadatas.find((m) => m.base === d.denom);
                const sup = data.data?.sup.supply.find((s) => s.denom === d.denom);
                return (
                  <tr key={d.denom}>
                    <td>{meta?.symbol ?? d.denom.split("/").pop()}</td>
                    <td>
                      {meta?.name ?? "—"}
                      <div className="mono muted" style={{ fontSize: 11 }}>
                        {d.denom}
                      </div>
                    </td>
                    <td>{sup ? formatAmount(sup.amount, sup.denom) : "0"}</td>
                    <td>
                      {d.admin ? (
                        <a className="mono" href={`#/account/${d.admin}`}>
                          {d.admin.slice(0, 12)}…
                        </a>
                      ) : (
                        <span className="badge ok">supply frozen</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="muted">No factory tokens yet.</p>
        )}
      </Panel>
    </>
  );
}
