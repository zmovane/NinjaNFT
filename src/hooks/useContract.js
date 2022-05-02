import { Contract } from "ethers";
import { useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";

function getProviderOrSigner(library, account) {
  return account ? library.getSigner(account).connectUnchecked() : library;
}

export function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return new Contract(
        address,
        ABI,
        withSignerIfPossible ? getProviderOrSigner(library, account) : null
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}
