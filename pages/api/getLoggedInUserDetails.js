import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;
    const results = await query({
      query: "Select * from Users where email=?;",
      values: [email],
    });
    await res.status(200).json(results);
  }
}
