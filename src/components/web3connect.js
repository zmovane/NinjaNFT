import { useWeb3React } from "@web3-react/core";

export function Web3Connect() {
  const { account, error } = useWeb3React();
  return error ? (
    <button className="btn btn-error w-200">Wrong network</button>
  ) : account ? (
    <button
      className="btn btn-primary w-48"
      style={{
        "text-overflow": "ellipsis",
        overflow: "hidden",
        display: "inline",
      }}
    >
      {account}
    </button>
  ) : (
    <>
      <button
        className="btn btn-primary w-48"
        style={{
          "text-overflow": "ellipsis",
          overflow: "hidden",
          display: "inline",
        }}
      >
        Connect wallet
      </button>
    </>
  );
}
