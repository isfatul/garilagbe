import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      car_ID,
      pickupDate,
      dropoffDate,
      amount,
      user_ID,
      payment_method,
      payment_details,
    } = req.body;
    console.log(req.body);
    const payment_ID = uuidv4();
    const res_ID = uuidv4();

    const results = await query({
      query:
        "INSERT INTO Payments (payment_ID, user_ID, res_ID, amount, payment_method, payment_details, payment_date ) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      values: [
        payment_ID,
        user_ID,
        res_ID,
        amount,
        payment_method,
        payment_details,
      ],
    });

    if (results.affectedRows === 0) {
      return res.status(500).json({ message: "Failed to create payment" });
    } else {
      const results2 = await query({
        query:
          "INSERT INTO Reservations (res_ID, user_ID, pickup_date, dropoff_date, car_ID, payment_id, payment_status, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        values: [
          res_ID,
          user_ID,
          pickupDate,
          dropoffDate,
          car_ID,
          payment_ID,
          "paid",
          amount,
        ],
      });
      if (results2.affectedRows === 0) {
        return res
          .status(500)
          .json({ message: "Failed to create reservation" });
      }
      await res.status(200).json(results2);
    }
  }
}
