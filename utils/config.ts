const configData = {
  testnet: {
    authUrl: "https://auth-tria.vercel.app",
    walletUrl: "https://staging-tria-wallet.vercel.app",
    socketUrl: "wss://staging.tria.so",
    environment: "testnet" as ENV,
    apiUrl: "https://staging.tria.so",
  },
  mainnet: {
    authUrl: "https://auth.tria.so",
    walletUrl: "https://wallet.tria.so",
    socketUrl: "wss://prod.tria.so",
    environment: "mainnet" as ENV,
    apiUrl: "https://prod.tria.so",
  },
};
type ENV = "testnet" | "mainnet";
const environment: ENV = "mainnet"; //process.env.REACT_APP_ENV as ENV;

export const config = configData[environment];
