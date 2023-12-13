//@ts-nocheck
"use client"
import Image from 'next/image'
import Tria from './components/Tria'
import dynamic from 'next/dynamic'
const TriaConnectProvider = dynamic(
  () => import("@tria-sdk/authenticate"),
  { ssr: false }
)
import { useTriaConnector, signMessage, writeContract, readContract, send, sendNft, useContractWrite } from "@tria-sdk/connect"
// import { getDefaultWallets } from "@tria-sdk/authenticate"
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
// import { authUrl } from '@/utils/config'
const authUrl = "https://auth-tria.vercel.app"

export default function Home() {

  const { globalData } = useTriaConnector({ authUrl })

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

  // const { connectors } = getDefaultWallets({
  //   appName: "Customer App powered by Tria",
  //   projectId: "bd38d3892c8fd8bc9dabf6fced0bd3c6",
  //   chains,
  // });

  // const wagmiConfig = createConfig({
  //   autoConnect: true,
  //   connectors,
  //   publicClient,
  //   webSocketPublicClient,
  // });

  const chainName = "POLYGON"
  const message = "Sign in with Tria"

  const callSign = async () => {
    // const { signMessage } = await import('@tria-sdk/connect');
    if (localStorage.getItem("wagmi.connected") == "true") {
      console.log("Metamask sign message")
      const { WalletController } = await import("@tria-sdk/utils")
      const wallet = new WalletController({ baseUrl: "https://staging.tria.so", walletType: { embedded: false }, selectedChainName: chainName })
      const res = await wallet.signMessage(message)
      console.log("Metamask signature res: ", res)
    } else if (localStorage.getItem("tria.wallet.store") !== null) {
      const data = await signMessage({ message, chainName }, undefined, authUrl)
      console.log('function returned data', data)
    }
  }

  const contractDetails = {
    contractAddress: '0xd1fD14e3Cf4f96E63A1561681dc8765DF8f7Cf91',
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: '_tokenID', type: 'uint256' },
          { internalType: 'address', name: '_claimer', type: 'address' },
        ],
        name: 'claimCoupon',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'claimCoupon',
    args: [1, '0xD243090e67788bc26968a7339680Fd0AE2b0b6A4'],
    // value: 0.000001,
  }

  const callWriteContract = async () => {
    if (localStorage.getItem("wagmi.connected") == "true") {
      console.log("Metamask sign message")
      const { WalletController } = await import("@tria-sdk/utils")
      const wallet = new WalletController({ baseUrl: "https://staging.tria.so", walletType: { embedded: false }, selectedChainName: chainName })
      const res = await wallet.callContract(contractDetails)
      console.log("Metamask signature res: ", res)
    } else if (localStorage.getItem("tria.wallet.store") !== null) {
      const data = await writeContract({
        chainName, contractDetails
      })
      console.log('function returned data', data)
    }
  }

  const { data, write } = useContractWrite({ chainName, contractDetails })
  console.log("useContractWrite", data)

  return (
    <>
      {/* <WagmiConfig config={wagmiConfig}> */}
      <Tria />
      <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callSign}>Sign Message</button>
      <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callWriteContract}>Write contract</button>
      <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={write}>useContractWrite</button>
      {/* </WagmiConfig> */}
    </>
  )
}
