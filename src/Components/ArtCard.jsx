import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseAbi, parseEther } from "viem";

function ArtCard(props) {
  const { address } = useAccount();
  const owner = props.galleryOwnerAddress;

  const { config, error } = usePrepareContractWrite({
    address: props.galleryAddress,
    abi: parseAbi([
      "function mint(address recipient, string memory tokenURI, uint256 quantity) payable",
    ]),
    functionName: "mint",
    args: [address, props.metadataIpfs, 1],
    value: parseEther(props.price),
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  console.log(data);

  useEffect(() => {
    if(isSuccess){
      updateArtworks();
    }
  }, [data]);

  async function editArtwork() {
    props.setMetadataIpfsModal(props.metadataIpfs);
    props.openEditModal();
  }

  async function buyArtwork() {
    await write?.();
  }

  async function updateArtworks() {
    const headers = { "Content-Type": "application/json" };
    const details = {
      galleryAddress: props.galleryAddress,
      metadataIpfs: props.metadataIpfs,
    };
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(details),
    };
    const res = await fetch(`/api/removeArtwork`, requestOptions);
    const data2 = await res.json();
    console.log(data2);
  }

  return (
    <>
      <Link to="#" className="relative block group">
        <img
          src={
            props.imageIPFS ||
            "https://res.cloudinary.com/dlvmyc0x3/image/upload/v1686525125/fotor-ai-2023061244133_gqbdgk.png"
          }
          alt=""
          className="h-[250px] w-full object-cover transition duration-500 group-hover:opacity-20 sm:h-[300px]"
        />

        <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
          <h3 className="text-2xl font-medium text-white opacity-0 group-hover:opacity-100 transition duration-500">
            {props.artName}
          </h3>
          <p className="mt-1 text-md text-gray-300 opacity-0 group-hover:opacity-100 transition duration-500">
            Artist: {props.artistName}
          </p>
          <p className="mt-1 text-md text-gray-300 opacity-0 group-hover:opacity-100 transition duration-500">
            Price: {props.price}
          </p>
          <div className="flex">
            <button
              className="mt-3 mx-2text-md px-2 text-white border-2 border-white rounded-none opacity-0 group-hover:opacity-100 transition duration-500"
              onClick={() => buyArtwork()}
            >
              {isSuccess ? "Purchased!" : isLoading ? "Loading..." : "Buy it!"}
            </button>
            {address.toLowerCase() === owner.toLowerCase() && (
              <button
                className="mt-3 mx-2 text-md px-2 text-white border-2 border-white rounded-none opacity-0 group-hover:opacity-100 transition duration-500"
                onClick={() => editArtwork()}
              >
                Edit Artwork
              </button>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}

export default ArtCard;
