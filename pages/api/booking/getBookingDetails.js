import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { res_ID } = req.body;
    const results = await query({
      query:
        "SELECT * FROM Reservations JOIN Cars ON Reservations.car_ID = Cars.car_ID JOIN Payments ON Reservations.payment_ID = Payments.payment_ID WHERE Reservations.res_ID = ?;",
      values: [res_ID],
    });
    await res.status(200).json(results);
  } else if (req.method === "PUT") {
    const { res_ID } = req.body;
    const results = await query({
      query:
        "SELECT Reservations.*, Cars.*, Payments.*, Users.name AS user_name, Users.email FROM Reservations JOIN Cars ON Reservations.car_ID = Cars.car_ID JOIN Payments ON Reservations.payment_ID = Payments.payment_ID JOIN Users ON Reservations.user_ID = Users.user_ID WHERE Reservations.res_ID = ?;",
      values: [res_ID],
    });
    await res.status(200).json(results);
  }
}
