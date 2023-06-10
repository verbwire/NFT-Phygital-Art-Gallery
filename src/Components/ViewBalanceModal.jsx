import React from "react";
import { useState } from "react";
import crendentials from "../../credentials";
import { useBalance } from "wagmi";

function ViewBalanceModal({ isOpen, closeModal, galleryAddress, galleryOwner }) {
  const chain = crendentials.chain;
  const { data, isError, isLoading } = useBalance({
    address: galleryAddress,
  });
  const [buttonState, setButtonState] = useState("Redeem Funds");

  async function withdrawRequest(walletAddress) {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
        "X-API-Key": crendentials.verbwireKey,
      },
      body: new URLSearchParams({
        chain: chain,
        contractAddress: galleryAddress,
        withdrawAddress: walletAddress,
      }),
    };

    const res = await fetch(
      "/verbwire/v1/nft/update/withdrawFundsToWallet",
      options
    );
    const data = await res.json();
    return data["transaction_details"]["transactionhash"];
  }

  async function withdrawFunds() {
    setButtonState("Processing...");
    const txn1 = await withdrawRequest(galleryOwner);
    setButtonState("Almost there...");
    const txn2 = await withdrawRequest(crendentials.ownerAddress);

    setButtonState("Success!");
    setTimeout(() => {
      closeModal();
    }, 2000);
  }

  return (
    <div
      className={`backdrop-blur-sm fixed inset-0 flex items-center justify-center ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div className="bg-gray-900 text-white w-1/3 p-8">
        <div className="block mb-10 ">
          <h2 className="text-3xl font-bold mb-4">
            Balance:{" "}
            {isLoading
              ? "Loading..."
              : isError
              ? "Error"
              : `${data?.formatted} ${data?.symbol}`}
          </h2>
          <a
            href={`https://testnets.opensea.io/assets/mumbai/${galleryAddress}`}
            target="_blank"
          >
            <h2 className="flex text-xl text-gray-300 font-bold mb-4">
              View contract on OpenSea
              <img
                src="https://testnets.opensea.io/static/images/logos/opensea-logo.svg"
                width={20}
                alt=""
                className="ml-1 opacity-90"
              />
            </h2>
          </a>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-2 px-4 rounded"
            onClick={withdrawFunds}
          >
            {buttonState}
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-sm text-white font-bold py-2 px-4 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewBalanceModal;
