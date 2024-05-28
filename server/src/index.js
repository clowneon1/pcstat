const express = require("express");
const dotenv = require("dotenv");
const connectToDatabase = require("./config/database");
const errorHandler = require("./error/error-handler");
const deviceRouter = require("./device/device-router");
require("./schedulers/cron-jobs");
const corsMiddleware = require("./config/cors-middleware");

//instance of express
const app = express();

//cors config
app.use(corsMiddleware);

//fetching port for application
const PORT = process.env.PORT || 3000;

//establish mongodb connection
connectToDatabase();

//calling master scheduler
// masterScheduler();
// jokeScheduler(2);

//using routes
app.use(express.json());
app.use("/api/devices", deviceRouter);

//error handling for non existing routes
app.use(errorHandler.routeNotFound);

//Error handler
app.use(errorHandler.errorResponse);

// server starts listening
app.listen(PORT, () => {
  console.info("app is running on port 3000");
});
