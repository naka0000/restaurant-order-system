#!/usr/bin/env python3
import subprocess
import time
import os

def take_screenshot():
    try:
        # Start HTTP server in background
        server_process = subprocess.Popen(['python3', '-m', 'http.server', '8080'], 
                                        cwd='/home/mrksye/hobby/restaurant-order-system',
                                        stdout=subprocess.DEVNULL, 
                                        stderr=subprocess.DEVNULL)
        
        # Wait for server to start
        time.sleep(2)
        
        # Use headless browser to take screenshot
        try:
            # Try with chromium-browser first
            subprocess.run([
                'chromium-browser', '--headless', '--disable-gpu', '--no-sandbox', 
                '--window-size=1200,800', '--screenshot=/tmp/restaurant_screenshot.png',
                'http://localhost:8080/index.html'
            ], check=True, timeout=10)
            print("Screenshot saved to /tmp/restaurant_screenshot.png")
        except:
            try:
                # Try with google-chrome
                subprocess.run([
                    'google-chrome', '--headless', '--disable-gpu', '--no-sandbox',
                    '--window-size=1200,800', '--screenshot=/tmp/restaurant_screenshot.png',
                    'http://localhost:8080/index.html'
                ], check=True, timeout=10)
                print("Screenshot saved to /tmp/restaurant_screenshot.png")
            except:
                print("No suitable browser found for screenshots")
        
        # Clean up server
        server_process.terminate()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    take_screenshot()