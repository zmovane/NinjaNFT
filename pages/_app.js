/* pages/_app.js */
import "../styles/globals.css";
import { NavItem } from "./components/navitem";

function MyApp({ Component, pageProps }) {
  return (
    <div className="px-8 py-5">
      <nav className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-2xl font-bold">AmoNFT</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal p-0">
            <NavItem href="/" title="Home" />
            <NavItem href="/create-nft" title="Sell NFT" />
            <NavItem href="/my-nfts" title="My NFTs" />
            <NavItem href="/dashboard" title="Dashboard" />
          </ul>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
