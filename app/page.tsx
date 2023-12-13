//@ts-nocheck
"use client"
import Image from 'next/image'
import Tria from './components/Tria'
import dynamic from 'next/dynamic'
const TriaConnectProvider = dynamic(
  () => import("authenticate-test-2"),
  { ssr: false }
)
import { signMessage, writeContract, readContract, send, sendNft, useContractWrite, useAccount, encrypt } from "@tria-sdk/connect"
import { getDefaultWallets } from "authenticate-test-2"
import { configureChains, createConfig, WagmiConfig } from "wagmi";

import * as naclUtil from "tweetnacl-util";
import * as nacl from "tweetnacl";
import * as sigUtil from "@metamask/eth-sig-util"

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
import { ethers } from 'ethers'

export default function Home() {

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

  const chainName = "FUSE"
  const message = "Sign in with Tria"

  // const contractDetails = {
  //   contractAddress: '0xd1fD14e3Cf4f96E63A1561681dc8765DF8f7Cf91',
  //   abi: [
  //     {
  //       inputs: [
  //         { internalType: 'uint256', name: '_tokenID', type: 'uint256' },
  //         { internalType: 'address', name: '_claimer', type: 'address' },
  //       ],
  //       name: 'claimCoupon',
  //       outputs: [],
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //   ],
  //   functionName: 'claimCoupon',
  //   args: [1, '0xD243090e67788bc26968a7339680Fd0AE2b0b6A4'],
  //   // value: 0.000001,
  // }

  const contractDetails = {
    contractAddress: '0x4EC3E1086CE46a8f8Af28db4FcfeCF2D51De337b',
    abi: [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
    ],
    functionName: 'mint',
    args: [0, 1],
    // value: 0.000001,
  }

  const callSign = async () => {
    // const { signMessage } = await import('@tria-sdk/connect');
    if (localStorage.getItem("wagmi.connected") == "true") {
      console.log("Metamask sign message")
      const { WalletController } = await import("@tria-sdk/utils")
      const wallet = new WalletController({ baseUrl: "https://prod.tria.so", walletType: { embedded: false }, selectedChainName: chainName })
      const res = await wallet.signMessage(message)
      console.log("Metamask signature res: ", res)
    } else if (localStorage.getItem("tria.wallet.store") !== null) {
      const data = await signMessage({ message, chainName })
      console.log('function returned data', data)
    }
  }



  const callWriteContract = async () => {
    if (localStorage.getItem("wagmi.connected") == "true") {
      console.log("Metamask sign message")
      const { WalletController } = await import("@tria-sdk/utils")
      const wallet = new WalletController({ baseUrl: "https://prod.tria.so", walletType: { embedded: false }, selectedChainName: chainName })
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

  const callEncrypt = async () => {
    // const publicKey = ethers.utils.computePublicKey("0x043b4596010e5a765fa330771e6f4b4b90d5d6dc3152433e624b90edd3aceac275cffe4a8902f62e4f7d8ff7cb0379a677890954240a784ef2e34a94d66eb7661c", true)

    // const publicKey = "0x043b4596010e5a765fa330771e6f4b4b90d5d6dc3152433e624b90edd3aceac275cffe4a8902f62e4f7d8ff7cb0379a677890954240a784ef2e34a94d66eb7661c"
    // const pkBuff = ethers.utils.arrayify(publicKey)
    // const publicKey64 = naclUtil.encodeBase64(pkBuff)
    // console.log("compressedPublicKey: ", { publicKey64, publicKey, pkBuff })
    const secretKey = "d7daece1bb241bffacee5d5da99199f49279544debef6bd0f4c2b806c390a05a"
    // ENCRYPT
    // 1. slice 0x from wallet.privateKey 
    // 2. and generate and save the encryption public key
    const pk = await getEncryptionPublicKey(secretKey)
    const res = await encrypt({ chainName, data: "Hello hi encrypt this", publicKey: pk })
    console.log("Encrypt res: ", res)

    console.log("DECRYPT DATA!!")
    const decryptedData = await decrypt(res, secretKey)
    console.log({ decryptedData })
  }

  async function getEncryptionPublicKey(secretKey: string): Promise<string> {
    try {
      const skBuff = new Uint8Array(Buffer.from(secretKey, 'hex'));
      const keyPair = nacl.box.keyPair.fromSecretKey(skBuff);
      const publicKey = naclUtil.encodeBase64(keyPair.publicKey);
      return publicKey;
    } catch (e: any) {
      throw e;
    }
  }

  /**
 *
 * @param data Decryt encrypted data with private key.
 * @param privateKey
 * @returns
 */
  async function decrypt(data: Uint8Array, privateKey: string) {
    const dec = new TextDecoder('utf-8');
    const encryptedAppString = dec.decode(data);

    console.log('decrypt', { encryptedAppString });

    let ethEncryptedData: EthEncryptedData = JSON.parse(encryptedAppString);

    const result = sigUtil.decrypt({
      encryptedData: ethEncryptedData,
      privateKey,
    });

    return result;
  }

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Tria />
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callSign}>Sign Message</button>
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callWriteContract}>Write contract</button>
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={write}>useContractWrite</button>
        <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={callEncrypt}>Encrypt Message</button>
      </WagmiConfig>
    </>
  )
}
