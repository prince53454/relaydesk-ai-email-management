import { connectDatabase } from "../config/database.js";
import { seedIfEmpty } from "./seedDatabase.js";
async function run() {
  await connectDatabase();
  const force = process.argv.includes("--force");
  const result = await seedIfEmpty(force);
  console.log("Seed result:", result);
  process.exit(0);
}
run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
