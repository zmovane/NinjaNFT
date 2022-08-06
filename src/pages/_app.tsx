import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import { NavBar } from "../components/navbar";
import type { AppProps } from "next/app";
function MyApp({ Component, pageProps }: AppProps) {
  function getLibrary(provider: ExternalProvider) {
    return new Web3Provider(provider);
  }
  return (
    <div className="px-8">
      <Web3ReactProvider getLibrary={getLibrary}>
        <NavBar />
        <Component {...pageProps} className="bg-base-300" />
      </Web3ReactProvider>
    </div>
  );
}

export default MyApp;
