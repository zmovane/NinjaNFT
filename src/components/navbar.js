import { useEffect } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import { NavItem } from "./navitem";

export function Navbar() {
  const { active, account, activate, deactivate } = useWeb3React();
  async function connect() {
    try {
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", false);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", true);
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
      </div>
      <ul className="menu menu-horizontal p-0">
        <NavItem href="/" title="Home" />
        <NavItem href="/create-nft" title="Sell NFT" />
        <NavItem href="/my-nfts" title="My NFTs" />
        <NavItem href="/dashboard" title="Dashboard" />
        <button
          className="btn btn-primary w-28"
          onClick={() => {
            active ? disconnect() : connect();
          }}
          style={{
            "text-overflow": "ellipsis",
            overflow: "hidden",
            display: "inline",
          }}
        >
          {active ? account : "Connect"}
        </button>
      </ul>
    </nav>
  );
}
