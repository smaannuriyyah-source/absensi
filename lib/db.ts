import { prisma } from "./prisma";
import { autoSeed } from "./auto-seed";

export { prisma as db } from "./prisma";

// Run auto-seed once (non-blocking)
let seedDone = false;
if (!seedDone) {
  seedDone = true;
  autoSeed().catch(console.error);
}
