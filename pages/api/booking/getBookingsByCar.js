import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { car_ID } = req.body;
    const results = await query({
      query:
        "SELECT * FROM Reservations JOIN Cars ON Reservations.car_ID = Cars.car_ID JOIN Payments ON Reservations.payment_ID = Payments.payment_ID WHERE Reservations.car_ID = ? ORDER BY Reservations.pickup_date DESC, Payments.payment_date DESC;",
      values: [car_ID],
    });
    await res.status(200).json(results);
  }
}
