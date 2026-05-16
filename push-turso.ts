import { createClient } from "@libsql/client";
import * as fs from "fs";

const url = "libsql://atomgoal-amogh-reddy.aws-ap-south-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzg5NTU1MDEsImlkIjoiMDE5ZTMyMDAtMDcwMS03MzEwLTlkYjEtNzlmMmI3YmE1NGQ4IiwicmlkIjoiYWEyM2M2ODAtYTIzMC00NmQ5LWE5MzItMzRjMzVjN2UwNGZjIn0.S6BMkVhf3clDiRsGIyYN4vLmhIBWkY1CL6WHbpeOKNxYgnQ7lfc6sQOUKg3URp4XUQEu3dbguwxzFv36r7uuAg";

async function main() {
  const client = createClient({ url, authToken });
  console.log("Connected to Turso!");

  const sql = fs.readFileSync("dump.sql", "utf-8");
  const statements = sql.split(";").map((s) => s.trim()).filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      await client.execute(statement);
    } catch (e: any) {
      if (!e.message.includes("already exists")) {
        console.error("Failed executing:", statement);
        console.error(e.message);
      }
    }
  }
  console.log("Schema pushed successfully!");
}

main().catch(console.error);
