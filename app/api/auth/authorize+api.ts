import {
    GOOGLE_CLIENT_ID,
    BASE_URL,
    APP_SCHEME,
    GOOGLE_AUTH_URL,
} from "@/constants/index";

export async function GET(request: Request) {
    if (!GOOGLE_CLIENT_ID) {
        return Response.json(
            {error: "Missing GOOGLE_CLIENT_ID environment variable"},
            {status: 500},
        );
    }

    const url = new URL(request.url);
    const internalClient = url.searchParams.get("client_id");
    const redirectUri = url.searchParams.get("redirect_uri");
    const scope = url.searchParams.get("scope") || "openid profile email";
    const rawState = url.searchParams.get("state") || "";

    // Debug logging
    console.log("Authorize API → redirectUri:", redirectUri);
    console.log("Authorize API → APP_SCHEME:", APP_SCHEME);
    console.log("Authorize API → BASE_URL:", BASE_URL);

    // Detect platform
    let platform: "mobile" | "web";
    if (redirectUri?.startsWith(`${APP_SCHEME}://`)) {
        platform = "mobile";
    } else if (
        redirectUri?.startsWith("http://localhost") ||
        redirectUri?.startsWith("https://") ||
        redirectUri === BASE_URL
    ) {
        platform = "web";
    } else {
        // Fallback
        platform = redirectUri?.includes("://") && !redirectUri.startsWith("http")
            ? "mobile"
            : "web";
    }

    console.log("Authorize API → detected platform:", platform);

    // State → platform bilgisini ekle
    const state = `${platform}|${rawState}`;
    if (!state) {
        return Response.json({error: "Invalid state"}, {status: 400});
    }

    // Only support Google for now
    if (internalClient !== "google") {
        return Response.json({error: "Invalid client"}, {status: 400});
    }

    // Build Google Auth URL
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `http://localhost:8081/api/auth/callback`,
        response_type: "code",
        scope,
        state,
        prompt: "select_account",
    });

    const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    console.log("Authorize API → redirecting to:", authUrl);

    return Response.redirect(authUrl);
}
