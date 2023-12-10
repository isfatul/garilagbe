import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_ID } = req.body;
    const results = await query({
      query: "Select * from Users where user_ID=?;",
      values: [user_ID],
    });
    await res.status(200).json(results);
  }
}
