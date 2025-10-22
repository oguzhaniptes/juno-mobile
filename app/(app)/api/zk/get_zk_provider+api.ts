// app/zklogin+api.ts
import { PublicKey } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { generateNonce, generateRandomness } from "@mysten/sui/zklogin";
import { ZkLoginPayload } from "@/types/auth";
import { createApiResponse } from "@/utils/api";

export async function POST(request: Request) {
  try {
    console.log("🔐 ZKLogin API - POST request received");

    const body = await request.json();
    const zkpRequest = body as { epoch: number };

    if (!zkpRequest) {
      return new Response(JSON.stringify(createApiResponse(false, undefined, "Undefined request body")), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const maxEpoch = zkpRequest.epoch + 2;
    console.log("⏰ Max Epoch:", maxEpoch);

    // Create ephemeral key pair
    const ephemeralKeyPair = new Ed25519Keypair();
    const ephemeralPrivateKeyB64 = ephemeralKeyPair.getSecretKey();
    const ephemeralPublicKey: PublicKey = ephemeralKeyPair.getPublicKey();
    const ephemeralPublicKeyB64 = ephemeralPublicKey.toBase64();

    console.log("🔑 Ephemeral Public Key:", ephemeralPublicKeyB64);

    // Create randomness and nonce
    const randomness = generateRandomness();
    const nonce = generateNonce(ephemeralPublicKey, maxEpoch, randomness);

    console.log("🎲 Randomness and Nonce generated");

    // Return payload
    const zkData: ZkLoginPayload = {
      randomness: randomness.toString(),
      nonce,
      ephemeralPublicKey: ephemeralPublicKeyB64,
      ephemeralPrivateKey: ephemeralPrivateKeyB64,
      maxEpoch,
    };

    console.log("✅ ZKLogin payload created successfully");

    return new Response(JSON.stringify(createApiResponse(true, zkData)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Error creating ZKLogin payload:", error);

    return new Response(JSON.stringify(createApiResponse(false, undefined, "Failed to create ZKLogin payload", error instanceof Error ? error.message : String(error))), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
