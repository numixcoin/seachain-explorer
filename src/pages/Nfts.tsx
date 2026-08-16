import { nftClassOwners, nftClasses, nftsOfClass, nftOwner } from "../lib/api";
import { Panel, useAsync } from "../components/Ui";

export function NftClasses() {
  const data = useAsync(
    async () => {
      const [classes, owners] = await Promise.all([nftClasses(), nftClassOwners()]);
      return { classes, owners };
    },
    [],
    20000,
  );

  return (
    <>
      <h1>NFT collections</h1>
      <Panel error={data.error} loading={data.loading}>
        {data.data?.classes.classes.length ? (
          <table>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Symbol</th>
                <th>Description</th>
                <th>Creator</th>
              </tr>
            </thead>
            <tbody>
              {data.data.classes.classes.map((c) => {
                const owner = data.data?.owners.classOwner?.find((o) => o.classId === c.id);
                return (
                  <tr key={c.id}>
                    <td>
                      <a href={`#/nfts/${c.id}`}>{c.name || c.id}</a>
                    </td>
                    <td>{c.symbol}</td>
                    <td className="muted">{c.description}</td>
                    <td>
                      {owner ? (
                        <a className="mono" href={`#/account/${owner.owner}`}>
                          {owner.owner.slice(0, 12)}…
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="muted">No collections yet.</p>
        )}
      </Panel>
    </>
  );
}

export function NftClass({ classId }: { classId: string }) {
  const data = useAsync(
    async () => {
      const nfts = await nftsOfClass(classId);
      const owners = await Promise.all(
        nfts.nfts.map(async (n) => {
          try {
            return (await nftOwner(classId, n.id)).owner;
          } catch {
            return "";
          }
        }),
      );
      return { nfts, owners };
    },
    [classId],
    20000,
  );

  return (
    <>
      <h1>{classId}</h1>
      <Panel error={data.error} loading={data.loading}>
        {data.data?.nfts.nfts.length ? (
          <table>
            <thead>
              <tr>
                <th>Token id</th>
                <th>URI</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {data.data.nfts.nfts.map((n, i) => (
                <tr key={n.id}>
                  <td className="mono">{n.id}</td>
                  <td className="mono">{n.uri}</td>
                  <td>
                    {data.data?.owners[i] ? (
                      <a className="mono" href={`#/account/${data.data.owners[i]}`}>
                        {data.data.owners[i].slice(0, 12)}…
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No NFTs minted in this collection.</p>
        )}
      </Panel>
    </>
  );
}
