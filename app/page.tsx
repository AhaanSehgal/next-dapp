"use client";
import Tria from "./components/Tria";

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

import { WalletController } from "@tria-sdk/web-test";

import { publicProvider } from "wagmi/providers/public";

import { config } from "@/utils/config";
import { useTriaConnector, useAccount, } from "@tria-sdk/connect";
import TriaHome from "./components/Home";

const supportedChains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  fantom,
  fuse,
  bsc,
  avalanche,
  polygonMumbai,
]

const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedChains,
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
        isNewChainsStale: false
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



const { authUrl, walletUrl } = config



export default function Home() {
  const { globalData } = useTriaConnector({ authUrl, walletUrl });
  const { account } = useAccount()
  // const [account, setAccount] = useState<Account | null>()
  // useMemo(() => {
  //   const account = await getAccount()
  //   setAccount(account)
  // }, [])


  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        {
          account ?
            <TriaHome />
            : <Tria />
        }
        {/* <button className=' top-2 left-2 px-2 py-2 bg-green-500 text-white rounded-md' onClick={write}>useContractWrite</button> */}
      </WagmiConfig>
    </>
  );
}
