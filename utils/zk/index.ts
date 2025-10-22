const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchZkProvider = async (currentEpoch: number) => {
  const fetchZk = async (retryCount = 0) => {
    try {
      const response = await fetch("/api/zk/get_zk_provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the current epoch to the backend API to calculate maxEpoch
        body: JSON.stringify({ epoch: currentEpoch }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || "ZK provider response unsuccessful");
      }

      return result.data;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.warn(`ZK provider fetch failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}), retrying...`, error);
        await sleep(RETRY_DELAY * (retryCount + 1));
        return fetchZk(retryCount + 1);
      }
      console.error("❌ Error fetching ZK provider after all retries:", error);
      return null;
    }
  };

  return fetchZk();
};
