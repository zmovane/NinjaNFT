import { marketplaceAddress } from "../../config";
import * as NFTMarketplaceJSON from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { Card } from "../components/card";
import { useNFTMarketplaceContract } from "../hooks/useContract";
import { CardType, NFTData } from "../interfaces";
import { useListedItems, useMyItems } from "../hooks/marketplace";
import { useRouter } from "next/router";

export default function CreatorDashboard() {
  const contract = useNFTMarketplaceContract(
    marketplaceAddress,
    NFTMarketplaceJSON.abi,
    true
  );
  const { listedItems, loaded: listedItemsLoaded } = useListedItems(contract);
  const { myItems, loaded: myItemsLoaded } = useMyItems(contract);
  const router = useRouter();

  function listNFT(nft: NFTData) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  const listedSection =
    listedItemsLoaded && !listedItems.length ? (
      <h2 className="text-2xl p-8">No NFTs listed</h2>
    ) : (
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

  const ownedSection =
    myItemsLoaded && !myItems.length ? (
      <h2 className="text-2xl p-8">No NFTs owned</h2>
    ) : (
      <div className="p-6">
        <h2 className="text-2xl py-2">Owned NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {myItems.map((item, i) => (
            <Card
              key={i.toString()}
              data={item}
              type={CardType.MINE_NO_LISTED}
              onClick={() => listNFT(item)}
            />
          ))}
        </div>
      </div>
    );

  return (
    <>
      {listedSection} {ownedSection}
    </>
  );
}
