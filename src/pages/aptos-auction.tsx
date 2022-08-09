import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card } from "../components/card";
import { CardType } from "../interfaces";
import { setIPFSGateway } from "../utils/nftstorage";

export default function AptosAuction() {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { creator, name, collection, uri } = router.query;
  useEffect(() => {
    fetchNFT();
  }, [uri]);

  async function fetchNFT() {
    if (!uri) return;
    const meta = await axios.get(setIPFSGateway(uri as string));
    console.log("image", meta.data.image);
    updateFormInput((state) => ({
      ...state,
      image: setIPFSGateway(meta.data.image),
    }));
  }

  // async function listNFTForSale() {
  //   if (!price) return;

  //   const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
  //   let listingPrice = await contract.getListingPrice();
  //   let transaction = await contract.resellToken(Number(id), priceFormatted, {
  //     value: listingPrice,
  //   });
  //   await transaction.wait();
  //   router.push("/");
  // }

  return (
    <div className="flex flex-col justify-center items-center">
      {formInput.image && (
        <div className="w-1/5 my-8">
          <Card
            key={`${collection}/${name}`}
            data={{ name, collection, image: formInput.image }}
            type={CardType.Noraml}
            onClick={undefined}
          />
        </div>
      )}

      <div className="w-1/4 flex flex-col pb-12">
        <input
          type="number"
          placeholder="Asset Price in Eth"
          className="mt-2 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <button
          onClick={undefined}
          className="btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
