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
} from "@tria-sdk/connect-staging";
// import { getDefaultWallets } from "authenticate-test-2"
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
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
import {
  test,
  testPolygon,
  sendNativeToken,
  testSignMessage,
  sendNftData,
} from "@/utils/data";
// import { authUrl } from '@/utils/config'

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

export const getDefaultWallets = ({ appName, projectId, chains }: any) => {
  // Set up connectors
  // if (!wagmiCore && !wagmiChains && !wagmi) {
  //   await loadWagmiCore()
  // }
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

const authUrl = "https://auth-tria.vercel.app";
const walletUrl = "https://staging-tria-wallet.vercel.app";
const socketUrl = "wss://staging.tria.so";
const environment = "testnet";
const apiUrl = "https://staging.tria.so";

export default function Home() {
  const { globalData } = useTriaConnector({ authUrl, walletUrl });
  const { account } = useAccount()
  const { chainName: selectedChainName } = useChainName()
  const [encryptedData, setEncryptedData] = useState<any>();

  const chainName = "POLYGON";
  const message = "Sign in with Tria";

  useEffect(() => {
    console.log({ account, selectedChainName })
  }, [account, selectedChainName])

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
    setEncryptedData(res?.data)
    console.log("function returned data", res);
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
    console.log("function returned data", res);
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
