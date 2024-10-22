import { http, createConfig } from "wagmi";
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors";
import { mainnet, klaytnBaobab } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, klaytnBaobab],
  connectors: [metaMask(), injected(), coinbaseWallet()],
  transports: {
    [mainnet.id]: http("https://public-en.node.kaia.io"),
    [klaytnBaobab.id]: http("https://public-en-kairos.node.kaia.io"),
  },
});
