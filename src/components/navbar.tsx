import { useEffect } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./wallet/connectors";
import { NavItem } from "./navitem";
import { Web3Connect } from "./web3connect";

export function NavBar() {
  const { activate } = useWeb3React();

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", "true");
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);
  return (
    <nav className="navbar py-4 px-4 bg-base-100">
      <div className="flex-1">
        <Image src="/logo.png" width={35} height={35} alt="logo" />
        <a className="btn btn-ghost normal-case text-2xl font-bold">NinjaNFT</a>
        <ul className="menu menu-horizontal p-0 ml-10">
          <NavItem href="/" title="Home" />
          <NavItem href="/create-nft" title="Sell NFT" />
          <NavItem href="/my-nfts" title="My NFTs" />
          <NavItem href="/dashboard" title="Dashboard" />
        </ul>
      </div>
      <Web3Connect />
    </nav>
  );
}
