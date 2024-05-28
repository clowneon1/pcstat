# service.py

import os
import socket
import platform
import subprocess
import time
import requests
import json
import servicemanager
import win32service
import win32event
import win32serviceutil
import winreg

class DeviceUpdaterService(win32serviceutil.ServiceFramework):
    _svc_name_ = "PCStatService"
    _svc_display_name_ = "PC stat Device Updater Service"
    _svc_description_ = "Automatically updates device information."

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.hWaitStop)

    def SvcDoRun(self):
        self.main()

    # Function to add registry entry for auto start
    def add_registry_entry(self):
        try:
            key = winreg.CreateKey(winreg.HKEY_LOCAL_MACHINE, "SYSTEM\\CurrentControlSet\\Services\\DeviceUpdaterService")
            winreg.SetValueEx(key, "Description", 0, winreg.REG_SZ, self._svc_description_)
            winreg.SetValueEx(key, "Start", 0, winreg.REG_DWORD, 2)  # Auto start
            winreg.CloseKey(key)
            print("Registry entry added for auto start.")
        except Exception as e:
            print(f"Error adding registry entry: {e}")

    def get_device_name(self):
        return socket.gethostname()

    def get_router_name(self):
        try:
            system = platform.system()
            if system == "Windows":
                result = subprocess.run(["netsh", "wlan", "show", "interfaces"], capture_output=True, text=True)
                output_lines = result.stdout.splitlines()
                ssid_line = next((line for line in output_lines if "SSID" in line), None)
                if ssid_line:
                    router_name = ssid_line.split(":")[1].strip()
                    return router_name
                else:
                    return "Unknown"
            elif system == "Linux":
                result = subprocess.run(["iwgetid"], capture_output=True, text=True)
                router_name = result.stdout.strip().split('"')[1]
                return router_name
            else:
                return "Unsupported OS"
        except Exception as e:
            print(f"Error getting router name: {e}")
            return "Unknown"

    def get_private_ip(self):
        return socket.gethostbyname(socket.gethostname())

    def register_or_update_device(self):
        try:
            print("Registering or updating device...")
            if os.path.exists("device_id.txt"):
                with open("device_id.txt", "r") as file:
                    device_id = file.read().strip()
                    if device_id:
                        device_data = {
                            "name": self.get_device_name(),
                            "private_ip": self.get_private_ip(),
                            "network": self.get_router_name()
                        }
                        response = requests.put(f"http://localhost:3000/api/devices/{device_id}", json=device_data)
                        if response.status_code == 404:
                            response = requests.post("http://localhost:3000/api/devices/", json=device_data)
            else:
                device_data = {
                    "name": self.get_device_name(),
                    "private_ip": self.get_private_ip(),
                    "network": self.get_router_name()
                }
                response = requests.post("http://localhost:3000/api/devices/", json=device_data)

            if response.status_code == 201:
                device_id = response.json()["_id"]
                with open("device_id.txt", "w") as file:
                    file.write(device_id)
                print("Device registered or updated successfully.")
        except Exception as e:
            print(f"Error registering or updating device: {e}")

    def update_device(self):
        while True:
            try:
                print("Updating device...")
                if os.path.exists("device_id.txt"):
                    with open("device_id.txt", "r") as file:
                        device_id = file.read().strip()
                        if device_id:
                            response = requests.put(f"http://localhost:3000/api/devices/{device_id}")
                            if response.status_code == 404:
                                print("Device not found, re-registering...")
                                self.register_or_update_device()
            except Exception as e:
                print(f"Error updating device: {e}")

            time.sleep(900)  # 15 minutes

    def main(self):
        self.register_or_update_device()
        self.update_device()

if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(DeviceUpdaterService)
