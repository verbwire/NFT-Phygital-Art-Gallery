import React, { useState, useEffect } from "react";
import GalleryCard from "./GalleryCard";
import crendentials from "../../credentials";
import { useAccount } from "wagmi";

const Modal = ({ isOpen, closeModal }) => {
  const chain = crendentials.chain;
  const { address } = useAccount();
  const [galleryName, setGalleryName] = useState("");
  const [royaltyCharged, setRoyaltyCharged] = useState("");
  const [galleryOwnerAddress, setGalleryOwnerAddress] = useState("");
  const [buttonState, setButtonState] = useState("Submit");

  async function createGallery() {
    function generateRandomSymbol() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let randomString = "";

      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
      }

      return randomString;
    }

    let contractSymbol = generateRandomSymbol();
    const form = new FormData();
    form.append("chain", chain);
    form.append("contractType", "nft721");
    form.append("contractCategory", "advanced");
    form.append("isCollectionContract", "false");
    form.append("contractName", galleryName);
    form.append("contractSymbol", contractSymbol);
    form.append("recipientAddress", galleryOwnerAddress);

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "X-API-Key": crendentials.verbwireKey,
      },
    };

    options.body = form;

    const res = await fetch("/verbwire/v1/nft/deploy/deployContract", options);
    const data = await res.json();
    const contractAddress =
      data["transaction_details"]["createdContractAddress"];

    return contractAddress;
  }

  async function checkGalleryExists(contractAddress) {

    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": crendentials.verbwireKey,
        },
      };

      const res = await fetch(
        `/verbwire/v1/nft/userOps/contractDetails?contractAddress=${contractAddress}&chain=${chain}`,
        options
      );
      const data = await res.json();
      const galleryExists = data["contract_details"]["name"];
      if (galleryExists) {
        console.log("Gallery Exists");
        handleUpdate(contractAddress);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        console.log("Retrying...");
        checkGalleryExists(contractAddress);
      }, 3500);
    }
  }

  async function updateContract(contractAddress, walletAddress, share) {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
        "X-API-Key": crendentials.verbwireKey,
      },
      body: new URLSearchParams({
        chain: chain,
        contractAddress: contractAddress.toString(),
        payeeAddress: walletAddress.toString(),
        payeeShares: share,
      }),
    };

    const res2 = await fetch("/verbwire/v1/nft/update/addPayee", options);
    const data2 = await res2.json();
    return data2["transaction_details"]["transactionHash"];
  }

  async function addGallery(contractAddress) {
    const galleryObject = {
      address: contractAddress,
      Name: galleryName,
      Royalty: royaltyCharged,
      Owner: galleryOwnerAddress,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(galleryObject),
    };

    const res = await fetch("/api/addGallery", requestOptions);
    const data = await res.json();
    console.log(data);
    return data;
  }

  const handleSubmit = async () => {
    setButtonState("Creating Contract...");
    const contractAddress = await createGallery();
    if (contractAddress) {
      setButtonState("Waiting for Updates...");
      checkGalleryExists(contractAddress);
    } else {
      setButtonState("Error in Contract");
    }
  };

  async function handleUpdate(contractAddress) {
    setButtonState("Updating Contract...");
    const transactionHash1 = await updateContract(
      contractAddress,
      galleryOwnerAddress,
      100 - royaltyCharged
    );
    console.log(transactionHash1);
    const transactionHash2 = await updateContract(
      contractAddress,
      crendentials.ownerAddress,
      royaltyCharged
    );
    console.log(transactionHash2);
    if (transactionHash1 && transactionHash2) {
      setButtonState("Adding Gallery...");
      const isSuccess = await addGallery(contractAddress);
      if (isSuccess) {
        setGalleryName("");
        setRoyaltyCharged("");
        setGalleryOwnerAddress("");
        setButtonState("Success!");
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else {
        setButtonState("Error in Adding Gallery");
      }
    } else {
      setButtonState("Error in Updating");
    }
  }

  return (
    <div
      className={`backdrop-blur-sm fixed inset-0 flex items-center justify-center ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div className="bg-gray-900 text-white w-1/3 p-8">
        <h2 className="text-2xl font-bold mb-4">Add New Gallery</h2>
        <form className="">
          <div className="mb-4">
            <label
              htmlFor="galleryName"
              className="block text-white font-semibold mb-2"
            >
              Gallery Name
            </label>
            <input
              type="text"
              id="galleryName"
              className="bg-gray-900 w-full border rounded px-3 py-2"
              placeholder="Art Haven"
              value={galleryName}
              onChange={(e) => setGalleryName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="royaltyCharged"
              className="block text-white font-semibold mb-2"
            >
              Royalty Charged (in %)
            </label>
            <input
              type="text"
              id="royaltyCharged"
              placeholder="60"
              className="bg-gray-900 w-full border rounded px-3 py-2"
              value={royaltyCharged}
              onChange={(e) => setRoyaltyCharged(e.target.value)}
            />
            <label
              htmlFor="royaltyCharged"
              className="block text-white font-semibold mb-2"
            >
              Gallery Owner Address
            </label>
            <input
              type="text"
              id="galleryOwnerAddress"
              placeholder="0x..."
              className="bg-gray-900 w-full border rounded px-3 py-2"
              value={galleryOwnerAddress}
              onChange={(e) => setGalleryOwnerAddress(e.target.value)}
            />
          </div>
        </form>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            {buttonState}
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Galleries = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryObject, setGalleryObject] = useState({});
  const { address } = useAccount();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function getGalleries() {
    const res = await fetch("/api/galleries");
    const data = await res.json();
    setGalleryObject(data["Galleries"]);
    console.log(galleryObject);
  }

  async function addGallery() {
    openModal();
  }

  useEffect(() => {
    getGalleries();
  }, []);

  return (
    <>
      <section className="bg-gray-900 text-white min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="flex items-start justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold sm:text-5xl">Art Galleries</h2>

              <p className="mt-4 max-w-md text-gray-500">
                Add and view art galleries.
              </p>
            </div>

            {address.toLowerCase() ===
              crendentials.ownerAddress.toLowerCase() && (
              <button
                onClick={() => addGallery()}
                className="inline-flex items-center justify-center px-5 py-3 border border-blue-600 text-xs font-medium rounded-md text-white bg-transparent hover:bg-blue-600"
              >
                Add Gallery
              </button>
            )}
          </header>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryObject &&
              Object.keys(galleryObject).map((key) => {
                let gallery = galleryObject[key];
                return (
                  <>
                    <li key={key}>
                      <GalleryCard
                        address={key}
                        name={gallery["Name"]}
                        share={gallery["Royalty"]}
                      />
                    </li>
                  </>
                );
              })}
          </ul>
        </div>
      </section>
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default Galleries;
