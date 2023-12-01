import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { query } from "@/lib/db";

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const table = "Users";
        const { email, password, isAdminLogin } = credentials;
        // console.log(credentials);
        const queryStr = `SELECT * FROM ${table} WHERE email=?;`;
        const values = [email];
        const user = await query({ query: queryStr, values });
        if (user.length === 0) {
          throw new Error("No user found. Check your email and try again.");
        } else if (user[0].password !== password) {
          throw new Error("Wrong password.");
        } else if (isAdminLogin === "true" && user[0].isAdmin === 0) {
          throw new Error("You're not an admin.");
        } else if (isAdminLogin === "false" && user[0].isAdmin === 1) {
          throw new Error("You're not a user.");
        } else {
          return {
            email: user[0].email,
            name: user[0].name,
            id: user[0].user_ID,
            isAdmin: user[0].isAdmin,
          };
        }
      },
    }),
  ],
});
