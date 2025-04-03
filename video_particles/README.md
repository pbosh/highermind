# Video Particle Visualization

A web-based visualization tool that converts videos into interactive 3D particle clouds using p5.js.

## Features

- Convert videos into 3D particle clouds
- Interactive controls for particle spread and size
- Real-time video playback
- Support for multiple video files
- Simple local server setup

## Requirements

- Python 3.6 or higher
- Modern web browser with WebGL support

## Setup

1. Clone this repository or download the files
2. Place your MP4 video files in the `videos` directory
3. Start the server:
   ```bash
   python server.py
   ```
4. Open your web browser and navigate to `http://localhost:8000`

## Usage

1. The server will automatically detect MP4 files in the `videos` directory
2. Use the URL parameter `?video=filename.mp4` to load a specific video
3. Adjust the controls to modify the particle visualization:
   - Spread X/Y/Z: Controls the spread of particles in 3D space
   - Particle Size: Adjusts the size of individual particles
   - Sampling: Controls the density of particles (higher values = fewer particles)

## Controls

- Left mouse button: Rotate view
- Right mouse button: Pan view
- Mouse wheel: Zoom in/out

## Directory Structure

```
video_particles/
├── index.html          # Main web interface
├── server.py          # Python server script
├── static/            # Static assets
│   └── visualization.js  # p5.js visualization code
└── videos/            # Place your MP4 files here
```

## Development

The project uses:
- p5.js for visualization
- Python's built-in http.server for serving files
- WebGL for 3D rendering

## License

MIT License - feel free to use this project for your own purposes. 