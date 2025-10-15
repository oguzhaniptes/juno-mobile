import { BASE_URL, APP_SCHEME } from "@/constants/index";

export async function GET(request: Request) {
  const incomingParams = new URLSearchParams(request.url.split("?")[1]);
  const combinedPlatformAndState = incomingParams.get("state");

  // Debug logging
  console.log("Callback API - full URL:", request.url);
  console.log("Callback API - state:", combinedPlatformAndState);
  console.log("Callback API - APP_SCHEME:", APP_SCHEME);
  console.log("Callback API - BASE_URL:", BASE_URL);

  if (!combinedPlatformAndState) {
    return Response.json({ error: "Invalid state" }, { status: 400 });
  }

  // strip platform to return state as it was set on the client
  const platform = combinedPlatformAndState.split("|")[0];
  const state = combinedPlatformAndState.split("|")[1];

  console.log("Callback API - detected platform:", platform);
  console.log("Callback API - extracted state:", state);

  const outgoingParams = new URLSearchParams({
    code: incomingParams.get("code")?.toString() || "",
    state,
  });

  const redirectUrl =
    (platform === "web" ? BASE_URL + "redirect" : APP_SCHEME +"redirect") +
    "?" +
    outgoingParams.toString();

  console.log("Callback API - redirecting to:", redirectUrl);

  return Response.redirect(redirectUrl);
}
