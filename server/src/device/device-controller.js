const mongoose = require("mongoose");
const Device = require("./device-model");
const {
  notFound,
  deviceUpdated,
} = require("../custom-response/custom-response");

getAllDevices = async (req, res, next) => {
  try {
    const devices = await Device.find();

    res.status(200).json(devices);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateDevice = async (req, res, next) => {
  const { id } = req.params; // Extract the id from URL parameters
  // console.log(id);
  const { name, network, private_ip } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid device ID" });
  }

  try {
    // Generate current timestamp
    const timestamp = new Date().toISOString(); // or use any other method to generate the timestamp

    // Find the device by id and update it
    const updatedDevice = await Device.findByIdAndUpdate(
      id,
      {
        name,
        network,
        timestamp,
        private_ip,
        status: "active",
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedDevice) {
      return notFound(req, res);
    }

    return deviceUpdated(req, res);
  } catch (error) {
    console.error("Error updating device:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the device." });
  }
};

//post a device
const createDevice = async (req, res, next) => {
  try {
    const { name, network, private_ip } = req.body;
    const status = "active";

    // Generate current timestamp
    const timestamp = new Date().toISOString(); // or use any other method to generate the timestamp

    // Create a new device document
    const newDevice = new Device({
      name,
      network,
      timestamp,
      private_ip,
      status,
    });

    // Save the new device to the database
    const savedDevice = await newDevice.save();
    res.status(201).json({
      _id: savedDevice._id,
    });
  } catch (error) {
    console.error("Error creating device:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the device." });
  }
};

module.exports = {
  getAllDevices,
  updateDevice,
  createDevice,
};
