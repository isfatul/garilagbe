import mysql from "mysql2";

export const connect = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: 3306,
  database: process.env.MYSQL_DATABASE,
}).promise();

export async function excuteQuery({ query, values }) {
  try {
    const results = await connect.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}

export default async function handler(req, res) {
    const { query, values } = req.body;
    const results = await excuteQuery({ query, values });
    res.status(200).json(results);
    }
// Compare this snippet from pages/api/signup.js:
// import { connect } from "./db";
//
// export default async function handler(req, res) {
//   const { username, password, email, phone, address } = req.body;
//   const query = `INSERT INTO users (username, password, email, phone, address) VALUES (?, ?, ?, ?, ?);`;
//   const values = [username, password, email, phone, address];
//   try {
//     const results = await connect.query(query, values);
//     await connect.end();
//     res.status(200).json(results);
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// }
// Compare this snippet from pages/api/login.js:
// import { connect } from "./db";
//
// export default async function handler(req, res) {
//   const { username, password } = req.body;
//   const query = `SELECT * FROM users WHERE username=? AND password=?;`;
//   const values = [username, password];
//   try {
//     const results = await connect.query(query, values);
//     await connect.end();
//     res.status(200).json(results);
//   } catch (error) {
//     res.status(400).json({ error });

// Compare this snippet from pages/api/sys-admin/login.js:
// import { connect } from "../db";
//
// export default async function handler(req, res) {
//   const { username, password } = req.body;
//   const query = `SELECT * FROM sys_admin WHERE username=? AND password=?;`;
//   const values = [username, password];
//   try {
//     const results = await connect.query(query, values);
//     await connect.end();
//     res.status(200).json(results);
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// }
// Compare this snippet from pages/api/sys-admin/signup.js:
// import { connect } from "../db";
//
// export default async function handler(req, res) {
//   const { username, password, email, phone, address } = req.body;
//   const query = `INSERT INTO sys_admin (username, password, email, phone, address) VALUES (?, ?, ?, ?, ?);`;
//   const values = [username, password, email, phone, address];
//   try {
//     const results = await connect.query(query, values);
//     await connect.end();
//     res.status(200).json(results);
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// }