// cron-jobs.js
const cron = require("node-cron");
const Device = require("../device/device-model");

// Scheduler 1: Runs every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Running scheduler 1...");
  try {
    const sixMinutesAgo = new Date(Date.now() - 6 * 60 * 1000);
    const result = await Device.updateMany(
      { timestamp: { $lt: sixMinutesAgo }, status: "active" },
      { $set: { status: "inactive" } }
    );
    console.log(
      `${result.modifiedCount} devices marked as inactive after 6 mins`
    );
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
