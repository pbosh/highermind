import os
import http.server
import socketserver
import json
import signal
import subprocess
import time
from pathlib import Path

# Configuration
PORT = 8000
MAX_PORT_RETRIES = 10  # Try up to 10 different ports
VIDEOS_DIR = "videos"
ALLOWED_EXTENSIONS = {'.mp4'}

def find_available_port(start_port, max_retries):
    """Find an available port starting from start_port."""
    for port in range(start_port, start_port + max_retries):
        try:
            # Try to create a server socket
            with socketserver.TCPServer(("", port), None) as s:
                return port
        except OSError:
            continue
    raise OSError(f"Could not find an available port in range {start_port}-{start_port + max_retries - 1}")

def kill_existing_process(port):
    """Kill any process using the specified port."""
    try:
        # For macOS and Linux
        cmd = f"lsof -ti tcp:{port} | xargs kill -9"
        subprocess.run(cmd, shell=True, stderr=subprocess.DEVNULL)
        # Wait a moment for the port to be freed
        time.sleep(1)
        print(f"Killed existing process on port {port}")
    except:
        pass  # Ignore if no process found or command fails

class VideoHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            # Serve the main page
            self.path = '/index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        elif self.path == '/api/videos':
            # Return list of available videos
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            videos = []
            for file in os.listdir(VIDEOS_DIR):
                if os.path.splitext(file)[1].lower() in ALLOWED_EXTENSIONS:
                    videos.append({
                        'name': file,
                        'path': f'/videos/{file}'
                    })
            
            self.wfile.write(json.dumps(videos).encode())
            return
        elif self.path == '/api/config':
            # Serve the config file
            try:
                with open('config.json', 'r') as f:
                    config_data = f.read()
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(config_data.encode())
            except FileNotFoundError:
                self.send_error(404, "Config file not found")
            return
        elif self.path == '/api/browse-config':
            # Serve the browse config file
            try:
                with open('config-browse.json', 'r') as f:
                    return_data = json.load(f)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(return_data).encode())
            except Exception as e:
                self.send_error(500, str(e))
            return
        else:
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path == '/api/save_config':
            try:
                # Get content length
                content_length = int(self.headers['Content-Length'])
                # Read the data
                post_data = self.rfile.read(content_length)
                # Parse JSON
                config_data = json.loads(post_data.decode('utf-8'))
                
                # Save to config.json
                with open('config.json', 'w') as f:
                    json.dump(config_data, f, indent=4)
                
                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode())
            except Exception as e:
                self.send_error(500, str(e))
            return
        else:
            self.send_error(404, "Endpoint not found")

def setup_directories():
    """Create necessary directories if they don't exist."""
    os.makedirs(VIDEOS_DIR, exist_ok=True)
    os.makedirs('static', exist_ok=True)

def main():
    setup_directories()
    
    # Change to the project directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Try to find an available port
    try:
        # First try to kill any process on our preferred port
        kill_existing_process(PORT)
        
        # Try to use the preferred port first
        port = PORT
        httpd = socketserver.TCPServer(("", port), VideoHandler)
    except OSError:
        # If preferred port is still not available, find another one
        print(f"Port {PORT} is not available, searching for an open port...")
        port = find_available_port(PORT + 1, MAX_PORT_RETRIES)
        httpd = socketserver.TCPServer(("", port), VideoHandler)
    
    print(f"Serving at http://localhost:{port}")
    print(f"Place your MP4 files in the '{VIDEOS_DIR}' directory")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    main() 