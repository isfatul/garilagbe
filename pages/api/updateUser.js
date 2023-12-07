import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, profile_pic, email } = req.body;
    console.log(req.body);
    const results = await query({
      query: "UPDATE Users SET name=?, profile_pic=? WHERE email=?;",
      values: [name, profile_pic, email],
    });
    await res.status(200).json(results);
  }
}
