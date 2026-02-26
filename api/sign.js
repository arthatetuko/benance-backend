const elliptic = require("elliptic");
const crypto = require("crypto");

const EC = elliptic.ec;
const ec = new EC("secp256k1");

module.exports = async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { wallet, score } = req.body;

    if (!wallet || score === undefined) {
      return res.status(400).json({ error: "Missing wallet or score" });
    }

    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
      return res.status(500).json({ error: "PRIVATE_KEY not set" });
    }

    const timestamp = Math.floor(Date.now() / 1000) - 20;

   const message = `${wallet}:${score}:${timestamp}`;

    const hash = crypto.createHash("sha256").update(message).digest();

    const key = ec.keyFromPrivate(privateKey, "hex");

    const sig = key.sign(hash);

// r dan s masing-masing 32 byte
const r = sig.r.toArrayLike(Buffer, "be", 32);
const s = sig.s.toArrayLike(Buffer, "be", 32);

// gabungkan jadi 64 byte
const signature64 = Buffer.concat([r, s]).toString("base64");

return res.status(200).json({
  signature: signature64,
  timestamp
});

  } catch (err) {
    console.error("CRASH:", err);
    return res.status(500).json({ error: err.toString() });
  }
};