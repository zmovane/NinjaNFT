import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { marketplaceAddress } from "../../config";
import { abi } from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { Card } from "../components/card";
import { useContract } from "../hooks/useContract";
import { Address, CardType, NFTData } from "../interfaces";
import { NFTMarketplace } from "../typechain";

export default function Home() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const contract = useContract(marketplaceAddress, abi, true);
  console.log("contract:", typeof contract);
  const [loadingState, setLoadingState] = useState("not-loaded");

  async function loadNFTs() {
    const data = await contract!.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i: NFTMarketplace.MarketItemStruct) => {
        const tokenUri = await contract!.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item: NFTData = {
          price,
          tokenId: i.tokenId.toString(),
          seller: i.seller as Address,
          owner: i.owner as Address,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          tokenURI: tokenUri,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft: NFTData) {
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract!.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }

  useEffect(() => {
    loadNFTs();
  }, []);

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (
    <div className="p-6" style={{ maxWidth: "1600px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {nfts.map((nft, i) => (
          <Card
            key={i.toString()}
            data={nft}
            type={CardType.HOME_ON_SALE}
            onClick={() => buyNft(nft)}
          />
        ))}
      </div>
    </div>
  );
}
