import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Item } from "../interfaces";
import { NFTMarketplace } from "../typechain";
import { setIPFSGateway } from "../utils/nftstorage";

async function fillItem(
  contract: NFTMarketplace,
  i: NFTMarketplace.MarketItemStruct
) {
  const tokenUri = await contract.tokenURI(i.tokenId);
  const meta = (await axios.get(setIPFSGateway(tokenUri))).data;
  const price = ethers.utils.formatUnits(i.price.toString(), "ether");
  const item: Item = {
    price,
    isListing: false,
    type: "FixedPriceSale",
    id: i.tokenId.toString(),
    seller: i.seller.toString(),
    owner: i.owner.toString(),
    image: setIPFSGateway(meta.image),
    name: meta.name,
    description: meta.description,
    uri: tokenUri,
  };
  return item;
}

export const useListedItems = (contract: NFTMarketplace) => {
  const [listedItems, setListedItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const getListItems = async () => {
      const data = await contract.fetchItemsListed();
      const listedItems = await Promise.all(
        data.map(async (i: NFTMarketplace.MarketItemStruct) =>
          fillItem(contract, i)
        )
      );
      setListedItems(listedItems);
      setLoaded(true);
    };
    getListItems();
  }, [contract]);
  return { listedItems, loaded };
};

export const useMyItems = (contract: NFTMarketplace) => {
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const getMyItems = async () => {
      const data = await contract.fetchMyNFTs();
      const myItems = await Promise.all(
        data.map(async (i: NFTMarketplace.MarketItemStruct) =>
          fillItem(contract, i)
        )
      );
      setMyItems(myItems);
      setLoaded(true);
    };
    getMyItems();
  }, [contract]);
  return { myItems, loaded };
};

export const useMarketItems = (contract: NFTMarketplace, loadAt: number) => {
  const [marketItems, setMarketItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const getMarketItems = async () => {
      const data = await contract.fetchMarketItems();
      const marketItems = await Promise.all(
        data.map(async (i: NFTMarketplace.MarketItemStruct) =>
          fillItem(contract, i)
        )
      );
      setMarketItems(marketItems);
      setLoaded(true);
    };
    getMarketItems();
  }, [contract, loadAt]);
  return { marketItems, loaded };
};
