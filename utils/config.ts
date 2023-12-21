const configData = {
  testnet: {
    authUrl: "https://auth-tria.vercel.app",
    walletUrl: "https://staging-tria-wallet.vercel.app",
    socketUrl: "wss://staging.tria.so",
    environment: "testnet",
  },
  mainnet: {
    authUrl: "https://auth.tria.so",
    walletUrl: "https://wallet.tria.so",
    socketUrl: "wss://prod.tria.so",
    environment: "mainnet",
  },
};
type ENV = "testnet" | "mainnet";
const environment: ENV = process.env.ENV as ENV;

export const config = configData[environment];
