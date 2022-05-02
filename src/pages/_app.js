/* pages/_app.js */
import "../styles/globals.css";
import { NavItem } from "../components/navitem";

function MyApp({ Component, pageProps }) {
  return (
    <div className="px-8">
      <nav className="navbar py-4 bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-2xl font-bold">AmoNFT</a>
        </div>
        <ul className="menu menu-horizontal p-0">
          <NavItem href="/" title="Home" />
          <NavItem href="/create-nft" title="Sell NFT" />
          <NavItem href="/my-nfts" title="My NFTs" />
          <NavItem href="/dashboard" title="Dashboard" />
        </ul>
      </nav>
      <Component {...pageProps} className="bg-base-300" />
    </div>
  );
}

export default MyApp;
