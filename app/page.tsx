//@ts-nocheck
"use client"
import Image from 'next/image'
import Tria from './components/Tria'
import dynamic from 'next/dynamic'
const TriaConnectProvider = dynamic(
  () => import("authenticate-test-2"),
  { ssr: false }
)
import { useTriaConnector, signMessage, writeContract, readContract, send, sendNft } from "@tria-sdk/connect-staging"
import { getDefaultWallets } from "authenticate-test-2"
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
} from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { test, testPolygon, sendNativeToken, testSignMessage, sendNftData } from '@/utils/data'
// import { authUrl } from '@/utils/config'
const authUrl = "https://auth-tria.vercel.app"
const walletUrl = "https://staging-tria-wallet.vercel.app"
const socketUrl = "wss://staging.tria.so"
const environment = "testnet"
const apiUrl = "https://staging.tria.so"

export default function Home() {

  const { globalData } = useTriaConnector({ authUrl, walletUrl })


  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
      mainnet,
      polygon,
      optimism,
      arbitrum,
      base,
      zora,
      ...(process.env.REACT_APP_ENABLE_TESTNETS === "true" ? [goerli] : []),
    ],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "Customer App powered by Tria",
    projectId: "bd38d3892c8fd8bc9dabf6fced0bd3c6",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  const chainName = "POLYGON"
  const message = "Sign in with Tria"

  const callSign = async () => {
    const { chainName, message } = testSignMessage
    // if (localStorage.getItem("wagmi.connected") == "true") {
    //   const { WalletController } = await import("@tria-sdk/utils")
    //   const wallet = new WalletController({
    //     baseUrl: apiUrl,
    //     walletType: { embedded: false },
    //     selectedChainName: chainName,
    //     environment,
    //   });
    //   const res = await wallet.signMessage(message);
    //   console.log({ res })
    // }
    const data = await signMessage({ message, chainName }, undefined, authUrl, environment)
    console.log('function returned data', data)
  }

  const callSignMessage = async () => {
    const { signMessage } = await import("@tria-sdk/connect-staging")
    const { chainName, message } = testSignMessage
    const data = await signMessage({ message, chainName }, undefined, authUrl, environment)
    console.log('function returned data', data)
  }

  const callSignMumbai = async () => {
    const { chainName, message } = { chainName: "MUMBAI", message: "hello it worked on mumbai" }
    // if (localStorage.getItem("wagmi.connected") == "true") {
    //   const { WalletController } = await import("@tria-sdk/utils")
    //   const wallet = new WalletController({
    //     baseUrl: apiUrl,
    //     walletType: { embedded: false },
    //     selectedChainName: chainName,
    //     environment,
    //   });
    //   const res = await wallet.signMessage(message);
    //   console.log({ res })
    // }
    const data = await signMessage({ message, chainName }, undefined, authUrl, environment)
    console.log('function returned data', data)
  }

  const callSignFuse = async () => {
    const { chainName, message } = { chainName: "FUSE", message: "hello it worked on fuse" }
    // if (localStorage.getItem("wagmi.connected") == "true") {
    //   const { WalletController } = await import("@tria-sdk/utils")
    //   const wallet = new WalletController({
    //     baseUrl: apiUrl,
    //     walletType: { embedded: false },
    //     selectedChainName: chainName,
    //     environment,
    //   });
    //   const res = await wallet.signMessage(message);
    //   console.log({ res })
    // }
    const data = await signMessage({ message, chainName }, undefined, authUrl, environment)
    console.log('function returned data', data)
  }

  const callSend = async () => {
    // if (localStorage.getItem("wagmi.connected") == "true") {
    //   const { WalletController } = await import("@tria-sdk/utils")
    //   const wallet = new WalletController({
    //     baseUrl: apiUrl,
    //     walletType: { embedded: false },
    //     selectedChainName: sendNativeToken.chainName,
    //     environment,
    //   });
    //   const res = await wallet.send({ ...sendNativeToken, recipientTriaName: sendNativeToken.recepientAddress });
    //   console.log({ res })
    // }
    const data = await send({ ...sendNativeToken }, undefined, authUrl, environment)
    console.log("send response:", data)
  }

  const callSendNft = async () => {
    const { chainName, nftDetails, recipientTriaName } = sendNftData
    // if (localStorage.getItem("wagmi.connected") == "true") {
    //   const { WalletController } = await import("@tria-sdk/utils")
    //   const wallet = new WalletController({
    //     baseUrl: apiUrl,
    //     walletType: { embedded: false },
    //     selectedChainName: chainName,
    //     environment,
    //   });
    //   const res = await wallet.sendNFT(recipientTriaName, nftDetails);
    //   console.log({ res })
    // }
    const data = await sendNft(sendNftData, undefined, authUrl, environment)
    console.log("send response:", data)
  }

  const callWriteContract = async () => {
    const { chainName, contractDetails } = test;

    // if (localStorage.getItem("wagmi.connected") == "true") {
    //   const { WalletController } = await import("@tria-sdk/utils")
    //   const wallet = new WalletController({
    //     baseUrl: apiUrl,
    //     walletType: { embedded: false },
    //     selectedChainName: chainName,
    //     environment,
    //   });
    //   const res = await wallet.callContract(contractDetails);
    //   console.log({ res })
    // }

    const data = await writeContract({
      chainName: chainName, contractDetails: contractDetails
    }, undefined, authUrl, environment)
    console.log('function returned data', data)

  }

  const logout = () => {
    localStorage.removeItem("tria.wallet.store")
    localStorage.removeItem("wagmi.connected")
  }

  // const { data, write } = useContractWrite({ chainName, contractDetails }, undefined, authUrl, socketUrl)
  // console.log("useContractWrite", data)

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Tria />
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callSign}>Sign Message</button>
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callSignMumbai}>Sign Message Mumbai</button>
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callSignFuse}>Sign Message Fuse</button>
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callWriteContract}>Write contract</button>
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callSend}>Send</button>
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callSendNft}>Send NFT</button>
        <br />
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={logout}>Logout</button>
        {/* <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={write}>useContractWrite</button> */}
      </WagmiConfig>
    </>
  )
}
