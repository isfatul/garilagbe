import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const results = await query({
      query: `SELECT COUNT(payment_date) AS payment_count
        FROM Payments
        WHERE MONTH(payment_date) = MONTH(NOW()) AND YEAR(payment_date) = YEAR(NOW());
        `,
      values: [],
    });
    await res.status(200).json(results);
  }
}
