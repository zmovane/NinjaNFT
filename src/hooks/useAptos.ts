import { WalletClient } from "@martiandao/aptos-web3-bip44.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { setIPFSGateway } from "../utils/nftstorage";

const walletClient = new WalletClient(
  process.env.APTOS_NODE_URL,
  process.env.APTOS_FAUCET_URL
);

export interface NFTData {
  name: string;
  collection: string;
  description: string;
  image: string;
  uri: string;
  creator: string;
}

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

export function useAptosGetTokens(address: string) {
  const [NFTs, setNFTs] = useState<NFTData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getTokens = async () => {
      const tokenIds = await walletClient.getTokenIds(address, 100, 0);
      const tokens = await Promise.all(
        tokenIds.map(async (i) => {
          const token = await walletClient.getToken(i.data);
          token.creator = i.data.token_data_id.creator;
          return token;
        })
      );
      const items = await Promise.all(
        tokens.map(async (i) => {
          const meta = (await axios.get(setIPFSGateway(i.uri))).data;
          const item: NFTData = {
            name: i.name.toString(),
            collection: i.collection.toString(),
            description: meta.description,
            image: setIPFSGateway(meta.image),
            uri: i.uri,
            creator: i.creator,
          };
          return item;
        })
      );
      setLoaded(true);
      setNFTs(items);
    };
    if (address) {
      getTokens();
    }
  }, [address]);
  return { NFTs, loaded };
}
