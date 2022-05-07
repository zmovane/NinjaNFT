/* pages/resell-nft.js */
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { marketplaceAddress } from "../../config";
import NFTMarketplace from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { useContract } from "../hooks/useContract";
import Image from "next/image";

export default function ResellNFT() {
  const contract = useContract(marketplaceAddress, NFTMarketplace.abi);
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI);
    updateFormInput((state) => ({ ...state, image: meta.data.image }));
  }

  async function listNFTForSale() {
    if (!price) return;

    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(id, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          type="number"
          placeholder="Asset Price in Eth"
          className="mt-2 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        {image && <img className="rounded mt-4" width="350" src={image} />}
        <button
          onClick={listNFTForSale}
          className="btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
