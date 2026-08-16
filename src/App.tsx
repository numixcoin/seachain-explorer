import { useState } from "react";
import { config } from "./config";
import { navigate, useRoute } from "./lib/router";
import { Home } from "./pages/Home";
import { Block } from "./pages/Block";
import { Tx } from "./pages/Tx";
import { Account } from "./pages/Account";
import { Validators } from "./pages/Validators";
import { Tokens } from "./pages/Tokens";
import { NftClass, NftClasses } from "./pages/Nfts";

function Search() {
  const [term, setTerm] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    if (/^\d+$/.test(q)) navigate(`/block/${q}`);
    else if (q.startsWith(config.addressPrefix)) navigate(`/account/${q}`);
    else navigate(`/tx/${q.toUpperCase()}`);
    setTerm("");
  };

  return (
    <form className="search" onSubmit={submit}>
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search height, address or tx hash"
      />
      <button type="submit">Search</button>
    </form>
  );
}

function render(route: string) {
  const parts = route.split("/").filter(Boolean);
  switch (parts[0]) {
    case undefined:
      return <Home />;
    case "block":
      return <Block height={parts[1]} />;
    case "tx":
      return <Tx hash={parts[1]} />;
    case "account":
      return <Account address={parts[1]} />;
    case "validators":
      return <Validators />;
    case "tokens":
      return <Tokens />;
    case "nfts":
      return parts[1] ? <NftClass classId={parts[1]} /> : <NftClasses />;
    default:
      return <p className="error">Page not found.</p>;
  }
}

export default function App() {
  const route = useRoute();
  const active = (prefix: string) =>
    route === prefix || (prefix !== "/" && route.startsWith(prefix)) ? "active" : "";

  return (
    <>
      <header className="top">
        <div className="top-inner">
          <a className="brand" href="#/">
            SEA<span>CHAIN</span>
          </a>
          <nav>
            <a className={active("/")} href="#/">
              Overview
            </a>
            <a className={active("/validators")} href="#/validators">
              Validators
            </a>
            <a className={active("/tokens")} href="#/tokens">
              Tokens
            </a>
            <a className={active("/nfts")} href="#/nfts">
              NFTs
            </a>
            <a href={config.walletUrl}>Wallet</a>
          </nav>
          <Search />
        </div>
      </header>
      <main className="container">{render(route)}</main>
      <footer>
        SEACHAIN · {config.chainId} · <a href="https://seachain.xyz">seachain.xyz</a> ·{" "}
        <a href="https://github.com/numixcoin/seachain">source</a>
      </footer>
    </>
  );
}
