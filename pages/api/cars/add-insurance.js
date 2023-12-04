// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { coverage, company, policy_no, exp_date } = req.body;
    const insurance_id = uuidv4();

    const results = await query({
      query: `INSERT INTO Car_insurance (insurance_id, coverage, company, policy_no, exp_date) VALUE
            (
                ?,?,?,?,?
            );`,
      values: [insurance_id, coverage, company, policy_no, exp_date],
    });

    /*
    const testRequestBody = {
        coverage: "Full",
        company: "Geico",
        policy_no: "123456789",
        exp_date: "2022-01-01"
    };*/

    await res.status(200).json({ ...results, insurance_id });
  }
}
