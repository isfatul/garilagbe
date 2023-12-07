// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      name,
      number_plate,
      VIN,
      color,
      body,
      make,
      year,
      seats,
      height,
      doors,
      carImageURL,
      insurance_id,
    } = req.body;

    console.log(req.body);
    const car_ID = uuidv4();

    const results = await query({
      query: `INSERT INTO Cars (car_ID, name, number_plate, VIN, color, body, make, year, seats, height, doors, carImageURL, insurance_id) VALUE
        (
            ?,?,?,?,?,?,?,?,?,?,?,?,?
        );`,
      values: [
        car_ID,
        name,
        number_plate,
        VIN,
        color || null,
        body || null,
        make || null,
        year || null,
        seats || null,
        height || null,
        doors || null,
        carImageURL,
        insurance_id,
      ],
    });

    console.log(results);
    /*
    const testRequestBody = {
        name: "Test Car",
        number_plate: "ABC123",
        VIN: "123456789",
        color: "Red",
        body: "Sedan",
        make: "Toyota",
        year: 2022,
        seats: 5,
        height: 150,
        doors: 4,
        insurance_id: "XYZ789"
    };*/
    if (results.error) {
      await res.status(400).json(results);
    } else {
      await res.status(200).json({ ...results, car_ID });
    }

    // await res.status(200).json({ ...results, car_ID });
  }
}
