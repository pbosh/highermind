// --- Global Variables ---
let camera, scene, renderer, controls;
let videoTexture, videoMaterial;
let pointCloud;
let video, nextVideo;
let videos = [];
let currentVideoIndex = -1;
let config;
let overlayPlane;
let wasPlaying = false; // Track video state
let animationFrameId = null; // Track animation frame
let mousePosition = { x: 0, y: 0, z: 0 };
let isMouseHoverEnabled = false;
let centerPosition = { x: 0, y: 0, z: 1000 };
let targetCameraPosition = new THREE.Vector3();
let currentCameraPosition = new THREE.Vector3();
let lastMouseX = 0;
let lastMouseY = 0;
let dampingFactor = 0.05; // Reduced for more responsive movement
let isDragging = false; // Track drag state
let hoverLog = []; // Array to store hover movement logs

// --- Parameters ---
let params = {
    spreadX: 0,
    spreadY: 0,
    spreadZ: 0,
    heightMultiplier: 1,
    heightSpacing: 10,
    particleSize: 2,
    sampling: 8,
    randomness: 50,
    brightness: 0,
    overlay: 0,
    zoom: 1
};

// Load config and initialize parameters
async function loadConfig() {
    try {
        const response = await fetch('/config.json');
        config = await response.json();
        console.log('Loaded config:', config);
        
        // Initialize all parameters from config
        if (config && config.sliders) {
            Object.keys(config.sliders).forEach(key => {
                if (key in params) {
                    const sliderConfig = config.sliders[key];
                    params[key] = sliderConfig.default;
                    
                    const slider = document.getElementById(key);
                    const display = document.getElementById(`${key}Val`);
                    if (slider && display) {
                        slider.min = sliderConfig.min;
                        slider.max = sliderConfig.max;
                        if (sliderConfig.step) {
                            slider.step = sliderConfig.step;
                        }
                        slider.value = sliderConfig.default;
                        display.textContent = typeof sliderConfig.default === 'number' ? 
                            (sliderConfig.step ? sliderConfig.default.toFixed(1) : sliderConfig.default) : 
                            sliderConfig.default;
                    }
                }
            });
        }

        // Initialize hero image
        if (config.heroImage) {
            const heroImage = document.getElementById('heroImage');
            if (heroImage) {
                document.documentElement.style.setProperty('--hero-image-width', `${config.heroImage.width}px`);
                document.documentElement.style.setProperty('--hero-image-bottom', `${config.heroImage.positionFromBottom}px`);
                heroImage.src = config.heroImage.src;
                heroImage.style.display = 'block';
            }
        }

        // Initialize footer with styles from config
        if (config.footer) {
            const footer = document.getElementById('footer');
            if (footer) {
                const style = config.footer.style;
                
                // Apply styles from config
                footer.style.fontSize = `${style.fontSize}px`;
                footer.style.color = style.textColor;
                footer.style.backgroundColor = style.backgroundColor;
                footer.style.padding = style.padding;
                footer.style.width = style.position.width;
                
                // Parse and set content with markdown links
                footer.innerHTML = config.footer.text.replace(/\n/g, '<br>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
                
                // Style links
                const links = footer.getElementsByTagName('a');
                for (let link of links) {
                    link.style.color = style.linkColor;
                    link.addEventListener('mouseenter', () => {
                        link.style.color = style.linkHoverColor;
                    });
                    link.addEventListener('mouseleave', () => {
                        link.style.color = style.linkColor;
                    });
                }
                
                footer.style.display = 'block';
            }
        }
        
        // Set initial mouse states from config
        if (config.mouse) {
            // Set hover state
            if (typeof config.mouse.hoverEnabled !== 'undefined') {
                isMouseHoverEnabled = config.mouse.hoverEnabled;
                const mouseHoverCheckbox = document.getElementById('mouseHover');
                if (mouseHoverCheckbox) {
                    mouseHoverCheckbox.checked = isMouseHoverEnabled;
                    if (controls) {
                        controls.enabled = !isMouseHoverEnabled;
                    }
                }
            }
            
            // Set show controls state
            if (typeof config.mouse.showControls !== 'undefined') {
                const showControlsCheckbox = document.getElementById('showControls');
                const controlsPanel = document.getElementById('controls');
                if (showControlsCheckbox && controlsPanel) {
                    showControlsCheckbox.checked = config.mouse.showControls;
                    controlsPanel.style.display = config.mouse.showControls ? 'block' : 'none';
                }
            }
        }
        
        // Update point size if particle system exists
        if (pointCloud) {
            pointCloud.material.uniforms.pointSize.value = params.particleSize;
        }
        
        // Dispatch config loaded event
        document.dispatchEvent(new CustomEvent('configLoaded', { detail: config }));
        
        return config;
    } catch (error) {
        console.error('Error loading config:', error);
        return null;
    }
}

// Save current settings as defaults
function saveDefaults() {
    if (!config) return;
    
    // Create a copy of the current config
    const defaultConfig = JSON.parse(JSON.stringify(config));
    
    // Update slider defaults with current values
    Object.keys(params).forEach(key => {
        if (defaultConfig.sliders[key]) {
            defaultConfig.sliders[key].default = params[key];
        }
    });
    
    // Update mouse settings
    defaultConfig.mouse.startPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    defaultConfig.mouse.hoverEnabled = isMouseHoverEnabled;
    defaultConfig.mouse.showControls = document.getElementById('showControls').checked;

    // Save to localStorage instead of server
    try {
        localStorage.setItem('visualizerConfig', JSON.stringify(defaultConfig));
        console.log('Config saved to localStorage');
        config = defaultConfig;
        alert('Settings saved successfully!');
    } catch (error) {
        console.error('Error saving config:', error);
        alert('Error saving settings. Check console for details.');
    }
}

// Reset to default values from config
function resetToDefaults() {
    if (!config) return;

    // Reset all sliders
    for (const id in config.sliders) {
        const slider = document.getElementById(id);
        if (slider) {
            slider.value = config.sliders[id].default;
            params[id] = config.sliders[id].default;
            document.getElementById(`${id}Val`).textContent = params[id];
            
            if (id === 'particleSize') {
                pointCloud.material.uniforms.pointSize.value = params[id];
            }
        }
    }

    // Reset mouse states
    if (config.mouse) {
        // Reset hover state
        if (typeof config.mouse.hoverEnabled !== 'undefined') {
            isMouseHoverEnabled = config.mouse.hoverEnabled;
            const mouseHoverCheckbox = document.getElementById('mouseHover');
            if (mouseHoverCheckbox) {
                mouseHoverCheckbox.checked = isMouseHoverEnabled;
                if (controls) {
                    controls.enabled = !isMouseHoverEnabled;
                }
            }
        }
        
        // Reset show controls state
        if (typeof config.mouse.showControls !== 'undefined') {
            const showControlsCheckbox = document.getElementById('showControls');
            const controlsPanel = document.getElementById('controls');
            if (showControlsCheckbox && controlsPanel) {
                showControlsCheckbox.checked = config.mouse.showControls;
                controlsPanel.style.display = config.mouse.showControls ? 'block' : 'none';
            }
        }

        // Reset camera position
        if (config.mouse.startPosition) {
            camera.position.set(
                config.mouse.startPosition.x,
                config.mouse.startPosition.y,
                config.mouse.startPosition.z
            );
            updateMousePosition();
        }
    }
}

// Setup Three.js scene
async function init() {
    // Load config first
    await loadConfig();
    
    // Create scene
    scene = new THREE.Scene();
    
    // Setup camera with wider view
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 1000;
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    
    // Setup controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;  // Disable scroll-to-zoom only
    
    // Setup video elements
    video = document.getElementById('video');
    video.loop = false;
    video.playsInline = true;
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('disablePictureInPicture', '');
    video.setAttribute('disableRemotePlayback', '');
    
    nextVideo = document.getElementById('nextVideo');
    nextVideo.loop = false;
    nextVideo.playsInline = true;
    nextVideo.autoplay = true;
    nextVideo.muted = true;
    nextVideo.defaultMuted = true;
    nextVideo.setAttribute('disablePictureInPicture', '');
    nextVideo.setAttribute('disableRemotePlayback', '');
    
    // Initialize particle system
    initParticleSystem();
    
    // Initialize overlay plane
    initOverlayPlane();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load video list and start playing
    loadVideoList();
    
    // Start animation loop
    animate();
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    init().catch(error => {
        console.error('Error during initialization:', error);
    });
});

// Initialize particle system with optimized buffer geometry
function initParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        vertexColors: true,
        uniforms: {
            pointSize: { value: params.particleSize }
        }
    });
    
    // Pre-allocate buffers for maximum possible particles
    const maxParticles = (1920 * 1080) / (params.sampling * params.sampling) * 50; // Increased for height multiplier
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
}

// Initialize overlay plane
function initOverlayPlane() {
    // Create a 1x1 plane initially - we'll scale it based on video dimensions
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthTest: false,  // Ensure it renders on top
        depthWrite: false  // Don't write to depth buffer
    });
    
    overlayPlane = new THREE.Mesh(geometry, material);
    overlayPlane.renderOrder = 100; // Lower render order to keep below button
    scene.add(overlayPlane);
}

// Load video list and start playing
async function loadVideoList() {
    try {
        // Create a list of all available videos
        const videoList = [
            "UuzpE", "9HFXp", "GnYoV", "eYorX", "BIke9", "l71D0", "CAFs9", "J4oWF", "svGjl", "VGI3k",
            "iMsnI", "Fp8lM", "x3dbM", "qJ7WI", "ctkeS", "W4biI", "Kccuj", "PnDDg", "aIkbi", "kLyLd",
            "dA7cB", "lKDJg", "3Y7qO", "mAZQz", "Or2uR", "HlgXw", "fFpWH", "4EKnT", "UA2Py", "4NjIl",
            "IweSY", "JEvsg", "EB1kD", "S6Vx2", "vd6TZ", "kinZn", "wQO1V", "Jac9s", "daEpl", "1jPO5",
            "PHHhI", "9rewM", "28AFs", "yILAh", "Ben1F", "SIwKH", "3tE7S", "ULIQC", "HHt86", "drRaR",
            "tsaQe", "P4o8Z", "cfnCb", "GYQ5v", "PkZJ5", "FbZwR", "Ch7oQ", "79m9C", "ju6Hl", "97NCk",
            "DACVj", "nKfRd", "7Kqpc", "O9d3Z", "P0sue", "mncGo", "6GCTs", "PRHgF", "tOcZ4", "yV3YT",
            "JC20B", "XhLrV", "YmM8l", "O3Q7P", "5bt2u", "MmYH7", "FJx3n", "ZD1nR", "2v2Ug", "PnY7t",
            "68CKw", "FbqFi", "yQjoM", "isWVc", "SU3zX", "LhcAD", "sph5b", "xoldk", "8mPBS", "y63QD",
            "4LtHr", "kjOgR", "uPaum", "68C1T", "ULsz8", "W3vSN", "mGriH", "KVYGj", "bI4mI", "hB5nZ"
        ].map(name => ({
            name: name,
            path: `videos/${name}.mp4`
        }));
        
        videos = videoList;
        console.log('Available videos:', videos);
        if (videos.length > 0) {
            playRandomVideo();
        } else {
            document.getElementById('videoStatus').textContent = 'No videos found in videos directory';
        }
    } catch (error) {
        console.error('Error loading video list:', error);
        document.getElementById('videoStatus').textContent = 'Error loading videos';
    }
}

// Play a random video
function playRandomVideo() {
    if (videos.length === 0) return;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * videos.length);
    } while (newIndex === currentVideoIndex && videos.length > 1);
    
    currentVideoIndex = newIndex;
    const videoPath = videos[currentVideoIndex].path;
    console.log('Playing video:', videoPath);
    
    // Set up next video for buffering
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    nextVideo.src = videos[nextIndex].path;
    
    // Play current video
    video.src = videoPath;
    video.play()
        .then(() => {
            console.log('Video started playing:', videos[currentVideoIndex].name);
            document.getElementById('videoStatus').textContent = `Playing: ${videos[currentVideoIndex].name}`;
            
            // Create or update video texture
            if (!videoTexture) {
                videoTexture = new THREE.VideoTexture(video);
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;
            }
        })
        .catch(error => {
            console.error('Error playing video:', error);
            document.getElementById('videoStatus').textContent = 'Error playing video';
        });
}

// Update particle positions and colors based on video frame
function updateParticles() {
    if (!video.readyState === video.HAVE_ENOUGH_DATA || !videoTexture) return;
    
    // Update overlay plane if it exists
    if (overlayPlane) {
        if (!overlayPlane.material.map) {
            overlayPlane.material.map = videoTexture;
            overlayPlane.material.needsUpdate = true;
        }
        overlayPlane.material.opacity = params.overlay / 100;
        
        // Update overlay plane size to match video aspect ratio with zoom
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            const scale = Math.min(800 / video.videoWidth, 800 / video.videoHeight) * params.zoom;
            const scaledWidth = video.videoWidth * scale;
            const scaledHeight = video.videoHeight * scale;
            overlayPlane.scale.set(scaledWidth, scaledHeight, 1);
            overlayPlane.position.z = 1; // Ensure it's in front
        }
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Only set canvas size and draw video when we have valid dimensions
    if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const positions = pointCloud.geometry.attributes.position.array;
        const colors = pointCloud.geometry.attributes.color.array;
        let vertexIndex = 0;
        
        // Calculate scale to fit video in view with zoom
        const scale = Math.min(800 / canvas.width, 800 / canvas.height) * params.zoom;
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;
        
        // Center the video in world space
        const offsetX = -scaledWidth / 2;
        const offsetY = -scaledHeight / 2;
        
        // Calculate randomization factor (0 to 1)
        const randomFactor = params.randomness / 100;
        
        // Calculate number of points to generate based on height
        const basePointCount = (canvas.width * canvas.height) / (params.sampling * params.sampling);
        const totalPoints = params.heightMultiplier <= 1 ? basePointCount : basePointCount * Math.ceil(params.heightMultiplier / params.heightSpacing);
        
        for (let y = 0; y < canvas.height; y += params.sampling) {
            for (let x = 0; x < canvas.width; x += params.sampling) {
                const i = (y * canvas.width + x) * 4;
                const alpha = data[i + 3] / 255;
                
                if (alpha < 0.1) continue;
                
                // Apply brightness adjustment
                const adjustBrightness = (value) => {
                    const adjusted = (value / 255) + (params.brightness / 100);
                    return Math.max(0, Math.min(1, adjusted));
                };
                
                const r = adjustBrightness(data[i]);
                const g = adjustBrightness(data[i + 1]);
                const b = adjustBrightness(data[i + 2]);
                
                // Add controlled randomization to base position
                const randX = (Math.random() - 0.5) * params.sampling * 0.5 * randomFactor;
                const randY = (Math.random() - 0.5) * params.sampling * 0.5 * randomFactor;
                
                // Base position with controlled randomization
                const xPos = (x * scale + offsetX + randX) + (Math.random() - 0.5) * params.spreadX;
                const yPos = -(y * scale + offsetY + randY) + (Math.random() - 0.5) * params.spreadY;
                
                if (params.heightMultiplier <= 1) {
                    // Single point with controlled z variation
                    positions[vertexIndex] = xPos;
                    positions[vertexIndex + 1] = yPos;
                    positions[vertexIndex + 2] = (Math.random() - 0.5) * params.spreadZ * randomFactor;
                    
                    colors[vertexIndex] = r;
                    colors[vertexIndex + 1] = g;
                    colors[vertexIndex + 2] = b;
                    
                    vertexIndex += 3;
                } else {
                    // Create points along z-axis with controlled randomization
                    const numPoints = Math.ceil(params.heightMultiplier / params.heightSpacing);
                    for (let p = 0; p < numPoints; p++) {
                        // Add controlled randomization to z spacing
                        const zBase = p * params.heightSpacing;
                        const zRand = (Math.random() - 0.5) * params.heightSpacing * 0.5 * randomFactor;
                        const z = Math.min(params.heightMultiplier, zBase + zRand);
                        
                        // Add controlled position variation for each point
                        const pRandX = (Math.random() - 0.5) * 2 * randomFactor;
                        const pRandY = (Math.random() - 0.5) * 2 * randomFactor;
                        
                        positions[vertexIndex] = xPos + pRandX;
                        positions[vertexIndex + 1] = yPos + pRandY;
                        positions[vertexIndex + 2] = z + (Math.random() - 0.5) * params.spreadZ;
                        
                        colors[vertexIndex] = r;
                        colors[vertexIndex + 1] = g;
                        colors[vertexIndex + 2] = b;
                        
                        vertexIndex += 3;
                    }
                }
            }
        }
        
        // Update geometry
        pointCloud.geometry.setDrawRange(0, vertexIndex / 3);
        pointCloud.geometry.attributes.position.needsUpdate = true;
        pointCloud.geometry.attributes.color.needsUpdate = true;
    }
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Apply camera movement when hover is enabled
    if (isMouseHoverEnabled && !isDragging) {
        // Get current radius
        const currentRadius = camera.position.length();
        
        // Log before lerp
        hoverLog.push({
            timestamp: Date.now(),
            type: 'beforeLerp',
            cameraX: camera.position.x,
            cameraY: camera.position.y,
            cameraZ: camera.position.z
        });
        
        // Smoothly interpolate camera position
        camera.position.lerp(targetCameraPosition, dampingFactor);
        
        // Log after lerp
        hoverLog.push({
            timestamp: Date.now(),
            type: 'afterLerp',
            cameraX: camera.position.x,
            cameraY: camera.position.y,
            cameraZ: camera.position.z
        });
        
        // Ensure we maintain the exact radius
        const newRadius = camera.position.length();
        camera.position.multiplyScalar(currentRadius / newRadius);
        
        // Log after radius correction
        hoverLog.push({
            timestamp: Date.now(),
            type: 'afterRadius',
            cameraX: camera.position.x,
            cameraY: camera.position.y,
            cameraZ: camera.position.z
        });
        
        // Ensure camera looks at center
        camera.lookAt(scene.position);
        
        // Update mouse position display
        updateMousePosition();
    }
    
    controls.update();
    updateParticles();
    renderer.render(scene, camera);
}

// Resume animation and video playback
async function resumePlayback() {
    if (!renderer.info.render.frame) {
        // Restart animation loop if it's stopped
        animate();
    }
    
    if (wasPlaying) {
        try {
            await video.play();
            console.log('Video resumed successfully');
            document.getElementById('playPause').textContent = 'Pause';
        } catch (error) {
            console.error('Error resuming video:', error);
        }
    }
}

// Update camera position based on mouse
function updateCameraFromMouse(event) {
    if (!isMouseHoverEnabled || isDragging) return;
    
    // Calculate normalized device coordinates (-1 to +1) relative to screen center
    const rect = renderer.domElement.getBoundingClientRect();
    const screenCenterX = rect.left + rect.width / 2;
    const screenCenterY = rect.top + rect.height / 2;
    
    // Calculate position relative to screen center (-1 to 1)
    const x = (event.clientX - screenCenterX) / (rect.width / 2);
    const y = -(event.clientY - screenCenterY) / (rect.height / 2);
    
    // Get the current radius (distance from center)
    const radius = camera.position.length();
    
    // Calculate rotation angles with improved scaling
    const rotationSpeed = 3.0; // Increased for more rotation range
    
    // Map mouse position directly to camera position in a single plane
    // This creates a more intuitive mapping where moving the mouse left/right
    // rotates the camera around the Y axis, and up/down rotates around the X axis
    const targetX = x * radius * rotationSpeed;
    const targetY = y * radius * rotationSpeed;
    const targetZ = radius;
    
    // Update target position directly
    targetCameraPosition.set(targetX, targetY, targetZ);
    
    // Log hover movement data
    hoverLog.push({
        timestamp: Date.now(),
        mouseX: x,
        mouseY: y,
        cameraX: camera.position.x,
        cameraY: camera.position.y,
        cameraZ: camera.position.z,
        targetX: targetCameraPosition.x,
        targetY: targetCameraPosition.y,
        targetZ: targetCameraPosition.z
    });
    
    // Update mouse position display
    updateMousePosition();
}

// Reset camera to center
function resetToCenter() {
    const radius = centerPosition.z;
    targetCameraPosition.set(0, 0, radius);
    camera.position.set(0, 0, radius);
    camera.lookAt(scene.position);
    controls.update();
    updateMousePosition();
}

// Update mouse position display
function updateMousePosition() {
    // Get camera position and rotation
    const cameraPosition = camera.position;
    
    // Round to 2 decimal places for display
    mousePosition = {
        x: Math.round(cameraPosition.x * 100) / 100,
        y: Math.round(cameraPosition.y * 100) / 100,
        z: Math.round(cameraPosition.z * 100) / 100
    };
    
    // Update display
    document.getElementById('mouseX').textContent = mousePosition.x;
    document.getElementById('mouseY').textContent = mousePosition.y;
    document.getElementById('mouseZ').textContent = mousePosition.z;
}

// Setup UI event listeners
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
    
    // Controls visibility toggle
    const showControlsCheckbox = document.getElementById('showControls');
    const controlsPanel = document.getElementById('controls');
    if (showControlsCheckbox && controlsPanel) {
        showControlsCheckbox.addEventListener('change', (e) => {
            controlsPanel.style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    // Video controls
    const playPauseButton = document.getElementById('playPause');
    if (playPauseButton && video) {
        playPauseButton.addEventListener('click', () => {
            if (video.paused) {
                video.play()
                    .then(() => {
                        playPauseButton.textContent = 'Pause';
                    })
                    .catch(console.error);
            } else {
                video.pause();
                playPauseButton.textContent = 'Play';
            }
        });
    }
    
    // Handle video end
    if (video) {
        video.addEventListener('ended', () => {
            console.log('Video ended, playing next random video');
            playRandomVideo();
        });
    }
    
    // Save defaults button
    const saveDefaultsButton = document.getElementById('saveDefaults');
    if (saveDefaultsButton) {
        saveDefaultsButton.addEventListener('click', saveDefaults);
    }
    
    // Reset to defaults button
    const resetDefaultsButton = document.getElementById('resetDefaults');
    if (resetDefaultsButton) {
        resetDefaultsButton.addEventListener('click', () => {
            resetToDefaults();
            alert('Settings reset to defaults!');
        });
    }
    
    // Slider controls with config validation
    const sliderIds = ['spreadX', 'spreadY', 'spreadZ', 'heightMultiplier', 'heightSpacing', 
                      'brightness', 'particleSize', 'sampling', 'randomness', 'overlay', 'zoom'];
    
    sliderIds.forEach(id => {
        const slider = document.getElementById(id);
        const display = document.getElementById(`${id}Val`);
        if (slider && display) {
            slider.addEventListener('input', (e) => {
                if (id === 'particleSize' || id === 'zoom') {
                    const value = Math.round(parseFloat(e.target.value) * 10) / 10;
                    params[id] = value;
                    display.textContent = value.toFixed(1);
                    if (id === 'particleSize' && pointCloud) {
                        pointCloud.material.uniforms.pointSize.value = value;
                    }
                } else {
                    params[id] = parseFloat(e.target.value);
                    display.textContent = params[id];
                }
            });
        }
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Keep video playing when tab is hidden
            video.play().catch(console.error);
        }
    });

    // Handle page focus/blur
    window.addEventListener('blur', () => {
        // Keep video playing when tab loses focus
        video.play().catch(console.error);
    });

    window.addEventListener('focus', () => {
        // Ensure video is playing when tab regains focus
        video.play().catch(console.error);
    });

    // Mouse hover checkbox
    const mouseHoverCheckbox = document.getElementById('mouseHover');
    if (mouseHoverCheckbox) {
        mouseHoverCheckbox.addEventListener('change', (e) => {
            isMouseHoverEnabled = e.target.checked;
            if (isMouseHoverEnabled) {
                hoverLog = [];
                targetCameraPosition.copy(camera.position);
                controls.enabled = false;
                updateMousePosition();
            } else {
                controls.enabled = true;
                console.log('Hover Movement Log:', hoverLog);
                const logBlob = new Blob([JSON.stringify(hoverLog, null, 2)], { type: 'application/json' });
                const logUrl = URL.createObjectURL(logBlob);
                const a = document.createElement('a');
                a.href = logUrl;
                a.download = 'hover-movement-log.json';
                a.click();
                URL.revokeObjectURL(logUrl);
                resetToCenter();
            }
        });
    }

    // Mouse move handler
    if (renderer && renderer.domElement) {
        renderer.domElement.addEventListener('mousemove', (event) => {
            if (isMouseHoverEnabled) {
                updateCameraFromMouse(event);
            }
        });

        // Mouse down handler
        renderer.domElement.addEventListener('mousedown', () => {
            isDragging = true;
            if (isMouseHoverEnabled) {
                controls.enabled = true;
            }
        });

        // Mouse up handler
        renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
            if (isMouseHoverEnabled) {
                controls.enabled = false;
            }
        });
    }

    // Add controls change event listener
    if (controls) {
        controls.addEventListener('change', updateMousePosition);
    }

    // Initial camera position from config or center
    if (camera) {
        if (config && config.mouse && config.mouse.startPosition) {
            camera.position.set(
                config.mouse.startPosition.x,
                config.mouse.startPosition.y,
                config.mouse.startPosition.z || centerPosition.z
            );
        } else {
            resetToCenter();
        }
        updateMousePosition();
    }
} 