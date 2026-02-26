export default async function handler(req, res) {
  try {
    return res.status(200).json({
      test: "API WORKING"
    });
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
