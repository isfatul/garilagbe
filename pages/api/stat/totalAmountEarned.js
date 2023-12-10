import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const results = await query({
      query: `SELECT SUM(amount) AS total_amount FROM Payments;`,
      values: [],
    });
    await res.status(200).json(results);
  }
}
