import { useNFTMarketplaceContract } from "../hooks/useContract";
import { useRouter } from "next/router";
import { marketplaceAddress } from "../../config";
import * as NFTMarketplaceJSON from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { Card } from "../components/card";
import { CardType, NFTData } from "../interfaces";
import { useMyItems } from "../hooks/marketplace";

export default function MyAssets() {
  const contract = useNFTMarketplaceContract(
    marketplaceAddress,
    NFTMarketplaceJSON.abi,
    true
  );
  const { myItems, loaded } = useMyItems(contract);
  const router = useRouter();

  function listNFT(nft: NFTData) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }
  if (loaded && !myItems.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-6">
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
    </div>
  );
}
