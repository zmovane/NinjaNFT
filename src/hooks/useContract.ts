import { Contract, ContractInterface, Signer } from "ethers";
import { useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";

function getProviderOrSigner(
  library: JsonRpcProvider,
  account: string
): Provider | Signer {
  return account ? library.getSigner(account).connectUnchecked() : library;
}

export function useContract<T extends Contract>(
  address: string,
  ABI: ContractInterface,
  withSignerIfPossible = true
) {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return new Contract(
        address,
        ABI,
        withSignerIfPossible
          ? getProviderOrSigner(library, account!)
          : undefined
      ) as T;
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}
