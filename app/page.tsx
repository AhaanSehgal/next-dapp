"use client";
import Tria from "./components/Tria";
import { useEffect, useState } from "react";
import {
  useTriaConnector,
  useAccount,
  signMessage,
  writeContract,
  readContract,
  send,
  sendNft,
  encrypt,
  decrypt,
  useChainName,
} from "@tria-sdk/connect";
// import { getDefaultWallets } from "@tria-sdk/authenticate"
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  fantom,
  fuse,
  bsc,
  avalanche,
  polygonMumbai,
} from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import {
  test,
  testPolygon,
  sendNativeToken,
  testSignMessage,
  sendNftData,
} from "@/utils/data";
import { ethers } from "ethers";
import nacl from "tweetnacl"
import naclUtil from "tweetnacl-util"
import * as sigUtil from "@metamask/eth-sig-util"
// import { authUrl } from '@/utils/config'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    fantom,
    fuse,
    bsc,
    avalanche,
    polygonMumbai,
  ],
  [publicProvider()]
);

export const getDefaultWallets = ({ appName, projectId, chains }: any) => {
  const connectors = [
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName,
        //@ts-ignore
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        //@ts-ignore
        qrcode: true,
        shimDisconnect: true,
      },
    }),
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  ];
  return { connectors };
};

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

// const authUrl = "https://auth-tria.vercel.app";
// const walletUrl = "https://staging-tria-wallet.vercel.app";
// const socketUrl = "wss://staging.tria.so";
// const environment = "testnet";
// const apiUrl = "https://staging.tria.so";

const authUrl = "https://auth.tria.so";
const walletUrl = "https://wallet.tria.so";
const socketUrl = "wss://prod.tria.so";
const environment = "mainnet";
const apiUrl = "https://prod.tria.so";

export default function Home() {
  const { globalData } = useTriaConnector({ authUrl, walletUrl });
  // const { account } = useAccount()
  // const { chainName: selectedChainName } = useChainName()
  const [encryptedData, setEncryptedData] = useState<any>();

  const chainName = "POLYGON";
  const message = "Sign in with Tria";

  // useEffect(() => {
  //   console.log({ account, selectedChainName })
  // }, [account, selectedChainName])

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
    const { chainName, message } = testSignMessage;
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
    const data = await signMessage(
      { message, chainName },
      undefined,
      authUrl,
      environment
    );
    console.log("function returned data", data);
  };

  const callEncrypt = async () => {
    const { chainName, data } = {
      chainName: "POLYGON",
      data: "ENCRYPT THE DATA",
    };
    // if (localStorage.getItem("wagmi.connected") == "true") {
    //   const { WalletController } = await import("@tria-sdk/utils");
    //   const wallet = new WalletController({
    //     baseUrl: apiUrl,
    //     walletType: { embedded: false },
    //     selectedChainName: chainName,
    //     environment,
    //   });
    //   const res = await wallet.encrypt(data);
    //   console.log("Encrypted response", { res });
    //   setEncryptedData(res?.data);
    // }
    console.log("Encrypting..", data)
    const res = await encrypt(
      { chainName, data },
      undefined,
      authUrl,
      environment
    );
    //@ts-ignore
    setEncryptedData(res?.data as string)
    //@ts-ignore
    console.log("Encrypted data", res?.data);
  };

  const callDecrypt = async () => {
    const { chainName,
      encryptedData: dummyEncryptedData
    } = {
      chainName: "POLYGON",
      /*encryptedData: "HLFsNgV6Md4uyU61a/8CQ5nwiMjsnqRhTOXoPB5QMhld"*/
      encryptedData: JSON.stringify({
        ciphertext: "KiUWSO5AJ2pyMMMNV2kPzNy7wkRMBd0Upn3yOk86QZsv",
        ephemPublicKey: "Y+9w+iHnRm0Mf7zr5r1HTBVLR2pbOXbK0YnXGSZRm2Q=",
        nonce: "MAcPr7026iC40vutaTyEOq4RC6TqdhOF",
        version: "x25519-xsalsa20-poly1305",
      }),
    };
    // if (localStorage.getItem("wagmi.connected") == "true") {
    //   const { WalletController } = await import("@tria-sdk/utils");
    //   const wallet = new WalletController({
    //     baseUrl: apiUrl,
    //     walletType: { embedded: false },
    //     selectedChainName: chainName,
    //     environment,
    //   });
    //   console.log("Decrypt it", { encryptedData });
    //   const res = await wallet.decrypt(encryptedData);
    //   console.log({ res });
    // }

    const res = await decrypt(
      { chainName, encryptedData: encryptedData || dummyEncryptedData },
      undefined,
      authUrl,
      environment
    );
    console.log("Decrypted data", res);
  };

  // const callSignMessage = async () => {
  //   const { signMessage } = await import("@tria-sdk/connect-staging")
  //   const { chainName, message } = testSignMessage
  //   const data = await signMessage({ message, chainName }, undefined, authUrl, environment)
  //   console.log('function returned data', data)
  // }

  const callSignMumbai = async () => {
    const { chainName, message } = {
      chainName: "MUMBAI",
      message: "hello it worked on mumbai",
    };
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
    const data = await signMessage(
      { message, chainName },
      undefined,
      authUrl,
      environment
    );
    console.log("function returned data", data);
  };

  const callSignFuse = async () => {
    const { chainName, message } = {
      chainName: "FUSE",
      message: "hello it worked on fuse",
    };
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
    const data = await signMessage(
      { message, chainName },
      undefined,
      authUrl,
      environment
    );
    console.log("function returned data", data);
  };

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
    const data = await send(
      { ...sendNativeToken },
      undefined,
      authUrl,
      environment
    );
    console.log("send response:", data);
  };

  const callSendNft = async () => {
    const { chainName, nftDetails, recipientTriaName } = sendNftData;
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
    const data = await sendNft(sendNftData, undefined, authUrl, environment);
    console.log("send response:", data);
  };

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

    const data = await writeContract(
      {
        chainName: chainName,
        contractDetails: contractDetails,
      },
      undefined,
      authUrl,
      environment
    );
    console.log("function returned data", data);
  };

  const logout = () => {
    localStorage.removeItem("tria.wallet.store");
    localStorage.removeItem("wagmi.connected");
  };

  // const { data, write } = useContractWrite({ chainName, contractDetails }, undefined, authUrl, socketUrl)
  // console.log("useContractWrite", data)

  // const callEncrypt = async () => {
  //   // const publicKey = ethers.utils.computePublicKey("0x043b4596010e5a765fa330771e6f4b4b90d5d6dc3152433e624b90edd3aceac275cffe4a8902f62e4f7d8ff7cb0379a677890954240a784ef2e34a94d66eb7661c", true)

  //   // const publicKey = "0x043b4596010e5a765fa330771e6f4b4b90d5d6dc3152433e624b90edd3aceac275cffe4a8902f62e4f7d8ff7cb0379a677890954240a784ef2e34a94d66eb7661c"
  //   // const pkBuff = ethers.utils.arrayify(publicKey)
  //   // const publicKey64 = naclUtil.encodeBase64(pkBuff)
  //   // console.log("compressedPublicKey: ", { publicKey64, publicKey, pkBuff })
  //   const secretKey = "d7daece1bb241bffacee5d5da99199f49279544debef6bd0f4c2b806c390a05a"
  //   // ENCRYPT
  //   // 1. slice 0x from wallet.privateKey 
  //   // 2. and generate and save the encryption public key
  //   const pk = await getEncryptionPublicKey(secretKey)
  //   const res = await encrypt({ chainName, data: "Hello hi encrypt this", publicKey: pk })
  //   console.log("Encrypt res: ", res)

  //   console.log("DECRYPT DATA!!")
  //   const decryptedData = await decrypt(res, secretKey)
  //   console.log({ decryptedData })
  // }

  const embeddedEncrypt = async () => {
    const privateKeyWithPrefix = "0xd7daece1bb241bffacee5d5da99199f49279544debef6bd0f4c2b806c390a05a"
    const privateKey = privateKeyWithPrefix.startsWith('0x')
      ? privateKeyWithPrefix.slice(2)
      : privateKeyWithPrefix;


    // const address = "0x1a17Fc032e9e0500bc2C53a9c150dc353Da28018"
    // const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.blockpi.network/v1/rpc/public")
    // const signer = new ethers.Wallet(privateKey, provider)
    // const pubKey = await (signer.provider as ethers.providers.JsonRpcProvider).send("eth_getEncryptionPublicKey", [address])
    const pubKey = await getEncryptionPublicKey(privateKey)
    console.log({ pubKey })
  }

  const embeddedDecrypt = async () => {
    const privateKey = "0xd7daece1bb241bffacee5d5da99199f49279544debef6bd0f4c2b806c390a05a"
    const pKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;

    let ethEncryptedData: sigUtil.EthEncryptedData = {
      ciphertext: "KiUWSO5AJ2pyMMMNV2kPzNy7wkRMBd0Upn3yOk86QZsv",
      ephemPublicKey: "Y+9w+iHnRm0Mf7zr5r1HTBVLR2pbOXbK0YnXGSZRm2Q=",
      nonce: "MAcPr7026iC40vutaTyEOq4RC6TqdhOF",
      version: "x25519-xsalsa20-poly1305",
    }; // JSON.parse(encryptedData);

    const result = sigUtil.decrypt({
      encryptedData: ethEncryptedData,
      privateKey: pKey,
    });

    console.log({ result })
  }

  async function getEncryptionPublicKey(secretKey: string): Promise<string> {
    try {
      const sKey = secretKey.startsWith('0x')
        ? secretKey.slice(2)
        : secretKey;
      const skBuff = new Uint8Array(Buffer.from(sKey, 'hex'));
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
  // async function decrypt(data: Uint8Array, privateKey: string) {
  //   const dec = new TextDecoder('utf-8');
  //   const encryptedAppString = dec.decode(data);

  //   console.log('decrypt', { encryptedAppString });

  //   let ethEncryptedData: EthEncryptedData = JSON.parse(encryptedAppString);

  //   const result = sigUtil.decrypt({
  //     encryptedData: ethEncryptedData,
  //     privateKey,
  //   });

  //   return result;
  // }

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Tria />
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={callSign}
        >
          Sign Message
        </button>
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={callSignMumbai}
        >
          Sign Message Mumbai
        </button>
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={callSignFuse}
        >
          Sign Message Fuse
        </button>
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={callWriteContract}
        >
          Write contract
        </button>
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={callSend}
        >
          Send
        </button>
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={callSendNft}
        >
          Send NFT
        </button>
        <br />
        <br />
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={callEncrypt}
        >
          Encrypt
        </button>

        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={callDecrypt}
        >
          Decrypt
        </button>
        {/* <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={embeddedEncrypt}
        >
          Embedded Encrypt
        </button>
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={embeddedDecrypt}
        >
          Embedded Decrypt
        </button> */}
        <br />
        <br />
        <button
          className=" top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md"
          onClick={logout}
        >
          Logout
        </button>
        {/* <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={write}>useContractWrite</button> */}
      </WagmiConfig>
    </>
  );
}
