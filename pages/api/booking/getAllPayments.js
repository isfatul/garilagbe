import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const results = await query({
      query: `SELECT * FROM Payments ORDER BY payment_date DESC;`,
      values: [],
    });
    await res.status(200).json(results);
  }
}
