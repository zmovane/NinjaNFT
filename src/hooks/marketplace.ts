import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Address, NFTData } from "../interfaces";
import { NFTMarketplace } from "../typechain";

async function fillItem(
  contract: NFTMarketplace,
  i: NFTMarketplace.MarketItemStruct
) {
  const tokenUri = await contract.tokenURI(i.tokenId);
  const meta = (await axios.get(tokenUri)).data;
  const price = ethers.utils.formatUnits(i.price.toString(), "ether");
  const item: NFTData = {
    price,
    tokenId: i.tokenId.toString(),
    seller: i.seller as Address,
    owner: i.owner as Address,
    image: meta.image,
    name: meta.name,
    description: meta.description,
    tokenURI: tokenUri,
  };
  return item;
}

export const useListedItems = (contract: NFTMarketplace) => {
  const [listedItems, setListedItems] = useState<NFTData[]>([]);
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
  const [myItems, setMyItems] = useState<NFTData[]>([]);
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
  const [marketItems, setMarketItems] = useState<NFTData[]>([]);
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
