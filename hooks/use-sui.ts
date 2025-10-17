import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

export const useSui = () => {
  const rpcUrl = getFullnodeUrl("devnet");

  const suiClient = new SuiClient({ url: rpcUrl });

  return { suiClient };
};
