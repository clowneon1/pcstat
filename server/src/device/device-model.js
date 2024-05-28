const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  private_ip: {
    type: String,
    required: true,
  },
  network: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date, // Changed to Date type
  },
  status: {
    type: String,
    default: "active",
  },
});

const Device = mongoose.model("device", deviceSchema);

module.exports = Device;
