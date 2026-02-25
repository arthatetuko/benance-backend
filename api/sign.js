import elliptic from "elliptic";
import crypto from "crypto";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

export default async function handler(req, res) {
  try {

    // ✅ CORS HEADERS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // ✅ Handle preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const { wallet, score, timestamp } = body;

    // ⚠️ FIX ERROR DI SINI JUGA
    if (!wallet || !score || !timestamp) {
      return res.status(400).json({ error: "Missing data" });
    }

    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
      return res.status(500).json({ error: "Private key not set" });
    }

    const key = ec.keyFromPrivate(privateKey, "hex");

    const message = `${wallet}:${score}:${timestamp}`;

    const messageHash = crypto
      .createHash("sha256")
      .update(message)
      .digest();

    const signature = key.sign(messageHash);

    const r = signature.r.toArray("be", 32);
    const s = signature.s.toArray("be", 32);

    const signatureBytes = Buffer.concat([
      Buffer.from(r),
      Buffer.from(s)
    ]);

    const signatureBase64 = signatureBytes.toString("base64");

    return res.status(200).json({ signature: signatureBase64 });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
