/* pages/_app.js */
import "../styles/globals.css";
import { NavItem } from "../components/navitem";
import Image from "next/image";

function MyApp({ Component, pageProps }) {
  return (
    <div className="px-8">
      <nav className="navbar py-4 px-4 bg-base-100">
        <div className="flex-1">
          <Image src="/logo.png" width={35} height={35} alt="logo" />
          <a className="btn btn-ghost normal-case text-2xl font-bold">
            NinjaNFT
          </a>
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
