import crypto from "crypto";

const PRIVATE_KEY = "X9skLm72Pqa81ZnYtR04wLp9";

export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { wallet, score, timestamp } = req.body;

  if (!wallet || !score || !timestamp) {
    return res.status(400).json({ error: "Missing data" });
  }

  if (score > 200) {
    return res.status(400).json({ error: "Score too high" });
  }

  const message = wallet + ":" + score + ":" + timestamp;

  const signature = crypto
    .createHmac("sha256", PRIVATE_KEY)
    .update(message)
    .digest("hex");

  res.status(200).json({ signature });
}