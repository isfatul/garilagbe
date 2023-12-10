import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_ID } = req.body;
    const results = await query({
      query:
        "SELECT * FROM Reservations JOIN Cars ON Reservations.car_ID = Cars.car_ID JOIN Payments ON Reservations.payment_ID = Payments.payment_ID WHERE Reservations.user_ID = ? AND Reservations.dropoff_date < NOW();",
      values: [user_ID],
    });
    await res.status(200).json(results);
  }
}
