import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const results = await query({
      query: `SELECT COUNT(*) AS row_count FROM Payments;`,
      values: [],
    });
    await res.status(200).json(results);
  }
}
