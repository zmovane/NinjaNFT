/* pages/_app.js */
import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Navbar } from "../components/navbar";

function MyApp({ Component, pageProps }) {
  function getLibrary(provider) {
    return new Web3Provider(provider);
  }
  return (
    <div className="px-8">
      <Web3ReactProvider getLibrary={getLibrary}>
        <Navbar />
        <Component {...pageProps} className="bg-base-300" />
      </Web3ReactProvider>
    </div>
  );
}

export default MyApp;
