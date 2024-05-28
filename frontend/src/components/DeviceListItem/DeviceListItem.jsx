// DeviceListItem.jsx
import React from "react";
import "./DeviceListItem.css";

const DeviceListItem = ({ index, device }) => {
  return (
    <div className="device-list-item">
      <div className="device-list-item-info">{index}</div>
      <div className="device-list-item-info">
        <div className="device-name">
          <div className={`status-dot ${device.status}`} />
          {device.name}
        </div>
      </div>
      <div className="device-list-item-info">{device.private_ip}</div>
      <div className="device-list-item-info">{device.network}</div>
      <div className="device-list-item-info">
        {new Date(device.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default DeviceListItem;
