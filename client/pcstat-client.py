#this is a normal python program which can be run in cli

import requests
import json
import time
import os
import socket
import platform
import subprocess

# Function to get the device name
def get_device_name():
    return socket.gethostname()

# Function to get the network name (Wi-Fi or LAN)
def get_router_name():
    try:
        system = platform.system()
        if system == "Windows":
            # Run netsh wlan command to get router name (SSID) on Windows
            result = subprocess.run(["netsh", "wlan", "show", "interfaces"], capture_output=True, text=True)
            output_lines = result.stdout.splitlines()
            ssid_line = next((line for line in output_lines if "SSID" in line), None)
            if ssid_line:
                router_name = ssid_line.split(":")[1].strip()
                return router_name
            else:
                return "Unknown"
        elif system == "Linux":
            # Run iwgetid command to get router name (SSID) on Linux
            result = subprocess.run(["iwgetid"], capture_output=True, text=True)
            router_name = result.stdout.strip().split('"')[1]
            return router_name
        else:
            return "Unsupported OS"
    except Exception as e:
        print(f"Error getting router name: {e}")
        return "Unknown"

# Function to get the private IP address
def get_private_ip():
    return socket.gethostbyname(socket.gethostname())

# Function to register or update the device
def register_or_update_device():
    try:
        print("Registering or updating device...")
        # Check if device ID exists in local storage
        if os.path.exists("device_id.txt"):
            with open("device_id.txt", "r") as file:
                device_id = file.read().strip()
                if device_id:
                    # Update device
                    device_data = {
                        "name": get_device_name(),
                        "private_ip": get_private_ip(),
                        "network": get_router_name()
                    }
                    response = requests.put(f"http://localhost:3000/api/devices/{device_id}", json=device_data)
                    if response.status_code == 404:
                        # If device not found, re-register
                        response = requests.post("http://localhost:3000/api/devices/", json=device_data)
        else:
            # Register device
            device_data = {
                "name": get_device_name(),
                "private_ip": get_private_ip(),
                "network": get_router_name()
            }
            response = requests.post("http://localhost:3000/api/devices/", json=device_data)
        
        if response.status_code == 201:
            # Store device ID in local storage
            device_id = response.json()["_id"]
            with open("device_id.txt", "w") as file:
                file.write(device_id)
            print("Device registered or updated successfully.")
    except Exception as e:
        print(f"Error registering or updating device: {e}")

# Function to call update device every 15 mins
def update_device():
    while True:
        try:
            print("Updating device...")
            # Check if device ID exists in local storage
            if os.path.exists("device_id.txt"):
                with open("device_id.txt", "r") as file:
                    device_id = file.read().strip()
                    if device_id:
                        # Update device
                        response = requests.put(f"http://localhost:3000/api/devices/{device_id}")
                        if response.status_code == 404:
                            print("Device not found, re-registering...")
                            # Re-register device if not found
                            register_or_update_device()
        except Exception as e:
            print(f"Error updating device: {e}")
        
        # Wait for 15 minutes before next update
        time.sleep(30)

# Main function
def main():
    # Register or update device
    register_or_update_device()

    # Call update device every 15 mins
    update_device()

if __name__ == "__main__":
    main()
