import elliptic from "elliptic";
import crypto from "crypto";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

export default async function handler(req, res) {

  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { wallet, score } = req.body;

    if (!wallet || score === undefined) {
      return res.status(400).json({ error: "Missing data" });
    }

    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
      return res.status(500).json({ error: "Private key not set" });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const message = ${wallet}:${score}:${timestamp};

    const hash = crypto.createHash("sha256").update(message).digest();

    const key = ec.keyFromPrivate(privateKey, "hex");

    const signature = key.sign(hash);

    const signatureHex = signature.toDER("hex");

    return res.status(200).json({
      signature: signatureHex,
      timestamp
    });

  } catch (err) {
    console.error("SIGN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}