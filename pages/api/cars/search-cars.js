import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { search } = req.body;
    const results = await query({
      query:
        "SELECT * FROM cars WHERE LOWER(name) LIKE '%?%' OR LOWER(car_ID) LIKE '%?%' OR LOWER(VIN) LIKE '%?%' OR LOWER(number_plate) LIKE '%?%' OR LOWER(body) LIKE '%?%'",
      values: [search, search, search, search, search],
    });
    await res.status(200).json(results);
  }
}
