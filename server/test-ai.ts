import { getAIInsight } from "./services/aiService";
import "dotenv/config";

async function run() {
  console.log("Testing getAIInsight...");
  const result = await getAIInsight({ test: "data" });
  console.log("Result:", result);
}
run();
