import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { marketplaceAddress } from "../../config";
import { abi } from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { Card } from "../components/card";
import { useContract } from "../hooks/useContract";
import { Address, CardType, NFTData } from "../interfaces";
import { NFTMarketplace } from "../typechain/contracts/marketplace.sol";

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const contract = useContract(marketplaceAddress, abi, true);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const data = await contract!.fetchItemsListed();
    const items: NFTData[] = await Promise.all(
      data.map(async (i: NFTMarketplace.MarketItemStruct) => {
        const tokenUri = await contract!.tokenURI(i.tokenId);
        const meta = (await axios.get(tokenUri)).data;
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item: NFTData = {
          price,
          tokenId: i.tokenId.toString(),
          seller: i.seller as Address,
          owner: i.owner as Address,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          tokenURI: tokenUri
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>;
  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl py-2">Items Listed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <Card
              key={i.toString()}
              data={nft}
              onClick={undefined}
              type={CardType.MINE_LISTED}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
