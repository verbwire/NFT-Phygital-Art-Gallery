import React from "react";
import { useState } from "react";
import { useAccount } from "wagmi";
import crendentials from "../../credentials";
import { data } from "autoprefixer";

function AddArtworkModal({ isOpen, closeModal, galleryAddress, galleryOwner }) {
  const chain = crendentials.chain;
  const [artworkName, setArtworkName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [price, setPrice] = useState("");
  const [artworkImage, setArtworkImage] = useState(null);
  const [artistRoyalty, setArtistRoyalty] = useState("");
  const [artistWalletAddress, setArtistWalletAddress] = useState("");
  const [buttonState, setButtonState] = useState("Submit");
  const { address } = useAccount();

  async function storeIPFS() {
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const form = new FormData();
    form.append("name", artworkName);
    form.append("filePath", artworkImage);
    form.append(
      "description",
      `${artworkName} by ${artistName}`
    );
    form.append(
      "data",
      `[{"trait_type": "Artist Name", "value": "${artistName}"}, {"display_type": "date", "trait_type": "Listing Date", "value": "${unixTimestamp}"}, {"Artist Wallet Address": "${artistWalletAddress}"}, {"Artist Royalty": "${artistRoyalty}"}, {"Price": "${price}"}]`
    );

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "X-API-Key": crendentials.verbwireKey,
      },
    };

    options.body = form;

    const res = await fetch(
      "/verbwire/v1/nft/store/metadataFromImage",
      options
    );
    const data = await res.json();
    const metadata = data["ipfs_storage"]["metadata_url"];
    const image = data["ipfs_storage"]["ipfs_url"];
    const ipfsData = {
      metadata: metadata,
      image: image,
    };
    console.log(ipfsData);
    return ipfsData;
  }

  async function updateArtwork(ipfsData) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const payload = {
      'artName': artworkName,
      'artistName': artistName,
      'price': price,
      'artistRoyalty': artistRoyalty,
      'artistWalletAddress': artistWalletAddress,
      'metadataIpfs': ipfsData['metadata'],
      'imageIpfs': ipfsData['image'],
      'galleryAddress': galleryAddress,
    }

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    };

    const res = await fetch("/api/addArtwork", requestOptions);
    console.log(res);
    return res;
  }

  async function handleSubmit() {
    setButtonState("Storing on IPFS...");
    const ipfsData = await storeIPFS();
    setButtonState("Updating...");
    const isUpdated = await updateArtwork(ipfsData);
    setButtonState("Done");
    setTimeout(() => {
      closeModal();
    }, 1000);
  }

  return (
    <div
      className={`backdrop-blur-sm fixed inset-0 flex items-center justify-center ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div className="bg-gray-900 text-white w-1/3 p-8">
        <h2 className="text-2xl font-bold mb-4">Add New Artwork</h2>
        <form className="">
          <div className="mb-4">
            <label
              htmlFor="galleryName"
              className="block text-white font-semibold mb-2"
            >
              Artwork Name
            </label>
            <input
              type="text"
              id="artistName"
              className="bg-gray-900 w-full border rounded px-3 py-2"
              placeholder="Dancing Shadows"
              value={artworkName}
              onChange={(e) => setArtworkName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="royaltyCharged"
              className="block text-white font-semibold mb-2"
            >
              Artist Name
            </label>
            <input
              type="text"
              id="artistName"
              placeholder="Mason Bennett"
              className="bg-gray-900 w-full border rounded px-3 py-2"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
            />
          </div>
          <div className="flex">
            <div className="mb-4 mr-2 w-1/2">
              <label
                htmlFor="price"
                className="block text-white font-semibold mb-2"
              >
                Price (in Matic)
              </label>
              <input
                type="text"
                id="price"
                placeholder="2"
                className="bg-gray-900 w-full border rounded px-3 py-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-4  ml-2 w-1/2">
              <label
                htmlFor="artistRoyalty"
                className="block text-white font-semibold mb-2"
              >
                Artist Royalty (in %)
              </label>
              <input
                type="text"
                id="artistRoyalty"
                placeholder="75"
                className="bg-gray-900 w-full border rounded px-3 py-2"
                value={artistRoyalty}
                onChange={(e) => setArtistRoyalty(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="artworkImage"
              className="block text-white font-semibold mb-2"
            >
              Upload Artwork Image
            </label>

            <div className="bg-gray-900 w-full border rounded px-3 py-2 mb-4 h-12">
              <input
                type="file"
                id="artworkImage"
                className="absolute w-full"
                onChange={(e) => setArtworkImage(e.target.files[0])}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="artistWalletAddress"
                className="block text-white font-semibold mb-2"
              >
                Artist Wallet Address
              </label>
              <input
                type="text"
                id="artistWalletAddress"
                placeholder="0x99Cbd3456339183D77797509c8b0f6ff8eFE2284"
                className="bg-gray-900 w-full border rounded px-3 py-2"
                value={artistWalletAddress}
                onChange={(e) => setArtistWalletAddress(e.target.value)}
              />
            </div>
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
}

export default AddArtworkModal;
