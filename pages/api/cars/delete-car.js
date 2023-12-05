// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { car_ID } = req.body;
    // console.log(req.body);

    const results = await query({
      query: `DELETE FROM Cars WHERE car_ID=?;`,
      values: [car_ID],
    });

    // console.log(results);
    await res.status(200).json(results);
  }
}
