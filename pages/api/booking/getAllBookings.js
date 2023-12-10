import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const results = await query({
      query:
        "SELECT * FROM Reservations JOIN Cars ON Reservations.car_ID = Cars.car_ID JOIN Payments ON Reservations.payment_ID = Payments.payment_ID WHERE Reservations.dropoff_date >= CURRENT_DATE;",
      values: [],
    });
    await res.status(200).json(results);
  }
}
