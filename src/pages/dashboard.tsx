import { marketplaceAddress } from "../../config";
import * as NFTMarketplaceJSON from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { Card } from "../components/card";
import { useNFTMarketplaceContract } from "../hooks/useContract";
import { CardType } from "../interfaces";
import { useListedItems } from "../hooks/marketplace";

export default function CreatorDashboard() {
  const contract = useNFTMarketplaceContract(
    marketplaceAddress,
    NFTMarketplaceJSON.abi,
    true
  );
  const { listedItems, loaded } = useListedItems(contract);

  if (loaded && !listedItems.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>;
  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl py-2">Items Listed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {listedItems.map((item, i) => (
            <Card
              key={i.toString()}
              data={item}
              onClick={undefined}
              type={CardType.MINE_LISTED}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
