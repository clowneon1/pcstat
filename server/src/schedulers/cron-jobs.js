// cron-jobs.js
const cron = require("node-cron");
const Device = require("../device/device-model");

// Scheduler 1: Runs every 30 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Running scheduler 1...");
  try {
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
    const result = await Device.updateMany(
      { timestamp: { $lt: oneMinuteAgo }, status: "active" },
      { $set: { status: "inactive" } }
    );
    console.log(`${result.modifiedCount} devices marked as inactive`);
  } catch (error) {
    console.error("Error in scheduler 1:", error);
  }
});

// Scheduler 2: Runs every 3 days
cron.schedule("0 0 */3 * *", async () => {
  console.log("Running scheduler 2...");
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = await Device.deleteMany({
      timestamp: { $lt: threeDaysAgo },
    });
    console.log(`${result.deletedCount} devices removed from the database`);
  } catch (error) {
    console.error("Error in scheduler 2:", error);
  }
});
