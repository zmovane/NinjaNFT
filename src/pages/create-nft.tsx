import { ChangeEvent, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useNFTMarketplaceContract } from "../hooks/useContract";
import { marketplaceAddress } from "../../config";
import * as NFTMarketplaceJSON from "../../artifacts/contracts/marketplace.sol/NFTMarketplace.json";
import { uploadNFT } from "../utils/nft";

export default function CreateItem() {
  const contract = useNFTMarketplaceContract(
    marketplaceAddress,
    NFTMarketplaceJSON.abi,
    true
  );
  const [base64imgae, setBase64imgae] = useState("");
  const [file, setFile] = useState<File>();
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    /* upload image to IPFS */
    const file = e.target.files![0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = function (event) {
      setBase64imgae(event.target!.result!.toString());
    };
    reader.readAsDataURL(file);
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !file) return;
    try {
      const token = await uploadNFT(file, name, description);
      return token.url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let listingPrice = await contract.getListingPrice();
    let transaction = await contract.createToken(url!, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 p-4 textarea textarea-primary input-lg w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          type="number"
          className="mt-2 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {base64imgae && (
          <img className="rounded mt-4" width="350" src={base64imgae} />
        )}
        <button
          onClick={listNFTForSale}
          className="btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}
