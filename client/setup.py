# install_pcstat-service.py

import os
import sys
import subprocess

SERVICE_NAME = "PCStatService"

def install_service():
    try:
        # Check if the service is already installed
        if os.path.exists("pcstat-service.py"):
            # Stop the service
            subprocess.call([sys.executable, "pcstat-service.py", "stop"])
            print("Service stopped.")
            
            # Attempt to uninstall the service
            subprocess.call([sys.executable, "pcstat-service.py", "remove"])
            print("Service uninstalled.")
        else:
            print("Service script not found. Skipping uninstallation.")

        # Install the service
        subprocess.call([sys.executable, "pcstat-service.py", "install"])
        print("Service installed successfully.")
        
        # Add registry entry for auto start
        subprocess.call([sys.executable, "pcstat-service.py", "add_registry_entry"])
        print("Registry entry added for auto start.")
        
        # Start the service
        subprocess.call([sys.executable, "pcstat-service.py", "start"])
        print("Service started.")
    except Exception as e:
        print(f"Error installing service: {e}")

if __name__ == "__main__":
    install_service()
