import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WagmiConfig, createConfig, configureChains, useConnect, useAccount } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai, goerli, mainnet, arbitrum } from "wagmi/chains";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { infuraProvider } from 'wagmi/providers/infura';
import Home from "./Components/Home.jsx";
import Galleries from "./Components/Galleries";
import InsideGallery from "./Components/InsideGallery";
import crendentials from "../credentials";



const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()],
  );
  
const config = createConfig({
    autoConnect: true,
    connectors: [new MetaMaskConnector({chains})],
    publicClient,
  });

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <>
      <Home />
    </>
  },
  {
    path: "/view-galleries",
    element: <>
      <Galleries />
    </>
  },
  {
    path: "/gallery/:galleryAddress",
    element: <>
      <InsideGallery />
    </>
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RouterProvider router={BrowserRouter} />
    </WagmiConfig>
  </React.StrictMode>
);
