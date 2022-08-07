/* pages/my-nfts.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContract } from "../hooks/useContract";
import { useRouter } from "next/router";
import { marketplaceAddress } from "../../config";
import { abi } from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { Card } from "../components/card";
import { Address, CardType, NFTData } from "../interfaces";
import { NFTMarketplace } from "../typechain";

export default function MyAssets() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const contract = useContract(marketplaceAddress, abi, true);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const data = await contract!.fetchMyNFTs();
    const items = await Promise.all(
      data.map(async (i: NFTMarketplace.MarketItemStruct) => {
        const tokenURI = await contract!.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item : NFTData= {
          price,
          tokenId: i.tokenId.toString(),
          seller: i.seller as Address,
          owner: i.owner as Address,
          image: meta.data.image,
          tokenURI,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  function listNFT(nft: NFTData) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <Card
              key={i.toString()}
              data={nft}
              type={CardType.MINE_NO_LISTED}
              onClick={() => listNFT(nft)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
