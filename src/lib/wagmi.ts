import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { BASE_RPC_URL } from "./constants";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({ target: "phantom" }),
    coinbaseWallet({ appName: "CORTEX" }),
  ],
  transports: {
    [base.id]: http(BASE_RPC_URL),
  },
});
