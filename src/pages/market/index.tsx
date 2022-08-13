import { ethers } from "ethers";
import { marketplaceAddress } from "../../../config";
import * as NFTMarketplaceJSON from "../../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { Card } from "../../components/card";
import { useNFTMarketplaceContract } from "../../hooks/useContract";
import { Item } from "../../interfaces";
import { useMarketItems } from "../../hooks/marketplace";

export default function Home() {
  let loadAt: number = new Date().getTime();
  const contract = useNFTMarketplaceContract(
    marketplaceAddress,
    NFTMarketplaceJSON.abi,
    true
  );
  const { marketItems, loaded } = useMarketItems(contract, loadAt);

  async function buyNft(nft: Item) {
    const price = ethers.utils.parseEther(nft.price!.toString());
    const transaction = await contract.createMarketSale(nft.id!, {
      value: price,
    });
    await transaction.wait();
    loadAt = new Date().getTime();
  }

  if (loaded && !marketItems.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (
    <div className="p-6" style={{ maxWidth: "1600px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {marketItems.map((item, i) => (
          <Card
            key={i.toString()}
            data={item}
            type={"withBuyBtn"}
            onClick={() => buyNft(item)}
          />
        ))}
      </div>
    </div>
  );
}
