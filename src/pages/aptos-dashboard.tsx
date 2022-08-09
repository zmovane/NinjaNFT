import { Card } from "../components/card";
import { CardType } from "../interfaces";
import { useAptosGetTokens, useAptosWallet } from "../hooks/useAptos";
import { useRouter } from "next/router";
export default function CreatorDashboard() {
  const address = useAptosWallet();
  const { NFTs, loaded } = useAptosGetTokens(address);
  const router = useRouter();
  return loaded && !NFTs.length ? (
    <h2 className="text-2xl p-8">No NFTs owned</h2>
  ) : (
    <div>
      <div className="p-6">
        <h2 className="text-2xl py-2">Items owned</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {NFTs.map((item, i) => (
            <Card
              key={i.toString()}
              data={item}
              onClick={() =>
                router.push(
                  `/aptos-auction?creator=${item.creator}&name=${item.name}&collection=${item.collection}&uri=${item.uri}`
                )
              }
              type={CardType.WithListBtn}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
