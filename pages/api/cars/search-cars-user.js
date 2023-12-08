import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { carType, pickupDate, dropoffDate } = req.body;
    const results = await query({
      query:
        "SELECT c.carImageURL, c.name, c.car_ID, c.dailyRate, c.weeklyRate, c.seats, c.doors, c.year FROM Cars c LEFT JOIN Reservations r ON c.car_ID = r.car_ID WHERE c.body = ? AND ( (r.pickup_date IS NULL AND r.dropoff_date IS NULL) OR (? < r.pickup_date AND ? < r.pickup_date) OR (? > r.dropoff_date AND ? > r.dropoff_date) ); ",
      values: [carType, pickupDate, dropoffDate, pickupDate, dropoffDate],
    });
    await res.status(200).json(results);
  }
}
