import React, { useState, useEffect } from "react";
import GalleryCard from "./GalleryCard";
import { useParams } from "react-router-dom";
import ArtCard from "./ArtCard";
import { useAccount } from "wagmi";
import AddArtworkModal from "./AddArtworkModal";
import ViewBalanceModal from "./ViewBalanceModal";
import EditArtworkModal from "./EditArtworkModal";

function InsideGallery() {
  const { galleryAddress } = useParams();
  const [galleryName, setGalleryName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [artworks, setArtworks] = useState([]);
  const { address } = useAccount();

  const [isAddModalOpen, setisAddModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [metadataIpfsModal, setMetadataIpfsModal] = useState("");

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

  const openAddModal = () => {setisAddModalOpen(true);};
  const closeAddModal = () => {setisAddModalOpen(false);};

  const openBalanceModal = () => {setIsBalanceModalOpen(true);};
  const closeBalanceModal = () => {setIsBalanceModalOpen(false);};
  
  const openEditModal = () => {setIsEditModalOpen(true);};
  const closeEditModal = () => {setIsEditModalOpen(false);};

  async function getGalleryDetails() {
    const res = await fetch(`/api/galleries`);
    const data = await res.json();
    let galleryObject = data["Galleries"];
    for (let key in galleryObject) {
      if (key === galleryAddress) {
        setGalleryName(galleryObject[key]["Name"]);
        setOwnerAddress(galleryObject[key]["Owner"]);
      }
    }
  }

  async function getArtworks() {
    const res = await fetch(`/api/gallery/${galleryAddress}`);
    const data = await res.json();
    setArtworks(data["Artworks"]);
    console.log(data["Artworks"]);
  }

  useEffect(() => {
    getGalleryDetails();
    getArtworks();
  }, []);

  return (
    <>
      <section className="bg-gray-900 text-white min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="flex items-start justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold sm:text-5xl">
                {galleryName || `Loading...`}
              </h2>

              <p className="mt-4 max-w-md text-gray-500">
                Add and View listed Artworks in this gallery.
              </p>
            </div>

            {(address.toLowerCase() === ownerAddress.toLowerCase()) && 
            <div>
            <button
              onClick={() => openBalanceModal()}
              className=" px-5 py-3 border border-blue-600 text-xs font-medium rounded-md text-white bg-transparent hover:bg-blue-600"
            >
              View Balance
            </button>
            <button
              onClick={() => openAddModal()}
              className="mx-2 inline-flex items-center justify-center px-5 py-3 border border-blue-600 text-xs font-medium rounded-md text-white bg-transparent hover:bg-blue-600"
            >
              Add Artwork
            </button>
            </div>}
          </header>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {artworks &&
              Object.keys(artworks).map((key) => (
                <li key={key}>
                  <ArtCard
                    artName={artworks[key]["artName"]}
                    artistName={artworks[key]["artistName"]}
                    price={artworks[key]["price"]}
                    imageIPFS={artworks[key]["imageIpfs"]}
                    metadataIpfs={artworks[key]["metadataIpfs"]}
                    galleryOwnerAddress= {ownerAddress}
                    galleryAddress={galleryAddress}
                    setMetadataIpfsModal={setMetadataIpfsModal}
                    openEditModal={openEditModal}
                  />
                </li>
              ))}
          </ul>
        </div>
      </section>
      <AddArtworkModal isOpen={isAddModalOpen} closeModal={closeAddModal} galleryAddress={galleryAddress} galleryOwner={ownerAddress}/>
      <ViewBalanceModal isOpen={isBalanceModalOpen} closeModal={closeBalanceModal} galleryAddress={galleryAddress} galleryOwner={ownerAddress}/>
      <EditArtworkModal isOpen={isEditModalOpen} closeModal={closeEditModal} galleryAddress={galleryAddress} metadataIpfs={metadataIpfsModal}/>

    </>
  );
}

export default InsideGallery;
