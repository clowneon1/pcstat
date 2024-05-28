const cors = require("cors");

// Define CORS options
const corsOptions = {
  origin: [/^http:\/\/localhost(:\d+)?$/], // Allow GET requests from localhost
  methods: ["GET", "POST", "PUT"], // Allow GET, POST, and PUT requests
};

// Create a CORS middleware using the defined options
const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
