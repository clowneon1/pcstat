import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import DeviceListItem from "../DeviceListItem/DeviceListItem";
import "./DeviceList.css";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [sortedDevices, setSortedDevices] = useState([]);
  const [sortType, setSortType] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axios.get("/api/devices");
      setDevices(response.data);
      setSortedDevices(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  // Function to sort devices based on selected sort type
  const sortDevices = (type) => {
    let sorted;
    if (type === "network") {
      sorted = [...devices].sort((a, b) => a.network.localeCompare(b.network));
    } else if (type === "active") {
      sorted = [...devices].filter((device) => device.status === "active");
    } else if (type === "inactive") {
      sorted = [...devices].filter((device) => device.status === "inactive");
    } else {
      sorted = [...devices]; // Default to original order
    }
    setSortedDevices(sorted);
    setSortType(type);
  };

  // Function to handle sorting based on the selected sort type
  const handleSort = (type) => {
    if (type === "clear") {
      // Clear sorting
      sortDevices(null);
    } else {
      // Sort by selected type
      sortDevices(type);
    }
  };

  return (
    <div className="device-list-container">
      <div className="device-list-summary">
        Total Devices: {devices.length} | Active Devices:{" "}
        {devices.filter((device) => device.status === "active").length} |
        Inactive Devices:{" "}
        {devices.filter((device) => device.status === "inactive").length}
      </div>
      <div className="sort-dropdown">
        <div className="dropdown">
          <button className="dropbtn">
            Sort by {sortType ? `(${sortType})` : ""}
          </button>
          <div className="dropdown-content">
            <button onClick={() => handleSort("network")}>Network</button>
            <button onClick={() => handleSort("active")}>Active Devices</button>
            <button onClick={() => handleSort("inactive")}>
              Inactive Devices
            </button>
            <button onClick={() => handleSort("clear")}>Clear Sorting</button>
          </div>
        </div>
      </div>
      <div className="device-list-heading">
        <div className="device-list-heading-item">Index</div>
        <div className="device-list-heading-item">Name</div>
        <div className="device-list-heading-item">Private IP</div>
        <div className="device-list-heading-item">Network</div>
        <div className="device-list-heading-item">Timestamp</div>
      </div>
      <div className="device-list">
        {sortedDevices.map((device, index) => (
          <DeviceListItem key={device._id} index={index + 1} device={device} />
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
