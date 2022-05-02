/* pages/dashboard.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { marketplaceAddress } from "../../config";
import NFTMarketplace from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { Card } from "../components/card";
import { useContract } from "../hooks/useContract";

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([]);
  const contract = useContract(marketplaceAddress, NFTMarketplace.abi, true);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const data = await contract.fetchItemsListed();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
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
            <Card key={i} data={nft} />
          ))}
        </div>
      </div>
    </div>
  );
}
