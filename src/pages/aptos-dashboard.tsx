import { Card } from "../components/card";
import { CardType } from "../interfaces";
import { useAptosGetTokens, useAptosWallet } from "../hooks/useAptos";

export default function CreatorDashboard() {
  const address = useAptosWallet();
  const { NFTs, loaded } = useAptosGetTokens(address);
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
              onClick={undefined}
              type={CardType.MINE_LISTED}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
