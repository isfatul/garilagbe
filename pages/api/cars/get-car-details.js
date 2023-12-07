// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { car_ID } = req.body;
    const results = await query({
      query:
        "Select * from Cars c, Car_insurance i Where c.car_ID=? AND c.insurance_id=i.insurance_id;",
      values: [car_ID],
    });
    await res.status(200).json(results[0]);
  }
}
