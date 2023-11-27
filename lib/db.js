import mysql from "mysql2/promise";

export async function query({ query, values = [] }) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: 3306,
    database: process.env.MYSQL_DATABASE,
  });

  //   const connection = await mysql.createConnection({
  //     host: "localhost",
  //     user: "root",
  //     password: "",
  //     port: 3306,
  //     database: "CSE370_LAB",
  //   });

  try {
    const [results] = await connection.execute(query, values);
    await connection.end();
    return results;
  } catch (error) {
    // throw Error (error.message);
    return { error: JSON.stringify(error.message) };
  }
}
