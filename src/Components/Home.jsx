import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Connector,
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";

function Home() {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();

  async function setNetwork() {
    const networkId = "0x13881"; // Replace with the actual network ID
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkId }],
      });
    } catch (error) {
      // Handle error if the network switch fails
      console.error(error);
    }
  }
  useEffect(() => {
    setNetwork();
  }, []);

  //Wallet Connect Using Metamask Connector - Wagmi
  async function connectWallet(connector) {
    const { chain } = await connectAsync({ connector });
  }

  return (
    <>
      <section className="bg-gray-900 text-white">
        <div className="mx-auto px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              NFT Art Gallery
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              This project demonstrates Verbwire's use in managing an Art
              Gallery. Each physical artwork is represented as an NFT, with
              separate contracts for each gallery. Artists' metadata and
              royalties are included, and revenue splits can be customized.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {!isConnected &&
                connectors.map((connector) => {
                  const { id, name } = connector;
                  return (
                    <button
                      onClick={() => connectWallet(connector)}
                      key={id}
                      id={id}
                      className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                    >
                      Connect to {name}
                    </button>
                  );
                })}

              {isConnected && (
                <Link
                  className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                  to="/view-galleries"
                >
                  View Galleries
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
