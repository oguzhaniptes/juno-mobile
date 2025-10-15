

export async function GET(request: Request) {
    // Debug log: request URL
    console.log("Health API - full URL:", request.url);

    try {
        // Basit health check response
        const responseBody = {
            status: "ok",
            timestamp: Date.now(),
            message: "Server is healthy",

        };

        console.log("Health API - response:", );

        return new Response(JSON.stringify(responseBody), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Health API - error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
