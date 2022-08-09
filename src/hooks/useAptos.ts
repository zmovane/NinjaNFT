import { WalletClient } from "@martiandao/aptos-web3-bip44.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { setIPFSGateway } from "../utils/nftstorage";

const walletClient = new WalletClient(
  process.env.APTOS_NODE_URL,
  process.env.APTOS_FAUCET_URL
);

export function useAptosWallet() {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const connectAptosWallet = async () => {
      const { address } = await (window as any).martian.connect();
      if (address) {
        setAddress(address);
      }
    };
    connectAptosWallet();
  }, []);
  return address;
}

export interface NFTData {
  name: string;
  collection: string;
  description: string;
  image: string;
  uri: string;
}

export function useAptosGetTokens(address: string) {
  const [NFTs, setNFTs] = useState<NFTData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getTokens = async () => {
      const tokens = await walletClient.getTokens(address, 100, 0);
      const items = await Promise.all(
        tokens.map(async (i) => {
          const meta = (await axios.get(setIPFSGateway(i.token.uri))).data;
          const item: NFTData = {
            name: i.token.name.toString(),
            collection: i.token.collection.toString(),
            description: meta.description,
            image: setIPFSGateway(meta.image),
            uri: i.token.uri,
          };
          return item;
        })
      );
      setLoaded(true);
      setNFTs(items);
    };
    getTokens();
  }, [address]);
  return { NFTs, loaded };
}
