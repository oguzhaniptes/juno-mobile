import { fromBase64 } from "@mysten/bcs";
import { toBigIntBE } from "bigint-buffer";
import { Buffer } from "buffer";

export function getUserAddress(ephemeralPublicKey: string) {
  const ephemeralPublicKeyArray: Uint8Array = fromBase64(ephemeralPublicKey);

  return toBigIntBE(Buffer.from(ephemeralPublicKeyArray)).toString();
}
