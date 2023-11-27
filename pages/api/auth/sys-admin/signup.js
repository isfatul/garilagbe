import { query } from "@/lib/db";

import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const table = "Users";
    const data = req.body;
    const uid = uuidv4();
    const { name, email, password } = data;

    const isAdmin = true;

    const queryStr = `INSERT INTO ${table} (user_ID, name, address, phone, email, password, profile_pic, verification_ID, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const values = [uid, name, null, null, email, password, null, "", isAdmin];

    await query({ query: queryStr, values })
      .then((result) => {
        res.status(201).json(result);
        console.log(res);
      })
      .catch((error) => {
        res.status(422).json({ error });
      });
  }
}
