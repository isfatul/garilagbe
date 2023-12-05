// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const results = await query({
      query: "Select * from Cars;",
      values: [],
    });
    await res.status(200).json(results);
  }
}
