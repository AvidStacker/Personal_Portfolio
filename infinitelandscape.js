// Get reference to the canvas element
const canvas = document.getElementById('backgroundCanvas');

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    60, 
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Create a debug camera for bird's-eye view
const debugCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
debugCamera.position.set(0, 500, 0); // Position it above the scene
debugCamera.lookAt(0, 0, 0); // Look down at the center

// Use the selected canvas for WebGL rendering
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Parameters for terrain chunks
const chunkSize = 1000;   
const numChunks = 5;      
const chunkWidthSegments = 200; 
const chunkDepthSegments = 100; 
const terrainWidth = 2000; 
const scale = 0.1; 

let chunks = [];
let prevEdgeHeights = []; // Store the last row's heights
const noise = new SimplexNoise();

// Reusable material
const basicMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
});

const texture = new THREE.TextureLoader().load('textures/water.png');
const standardMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xffffff,
    wireframe: true
});

const material = standardMaterial;

// Light source
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Function to create a terrain chunk at a given z position
function createChunk(zPosition) {
    const geometry = new THREE.PlaneGeometry(
        terrainWidth,
        chunkSize,
        chunkWidthSegments,
        chunkDepthSegments
    );

    const chunk = new THREE.Mesh(geometry, material);
    chunk.rotation.x = -Math.PI / 2;  
    chunk.position.z = zPosition;       

    updateChunkHeights(geometry.attributes.position, chunk.position.z);

    scene.add(chunk);
    return chunk;
}

// Helper function to update vertex heights
function updateChunkHeights(positionAttribute, zPosition) {
    const width = chunkWidthSegments; 
    const depth = chunkDepthSegments;  

    for (let i = 0; i < positionAttribute.count; i++) {
        const x = (i % (width + 1)) * scale; // Normalized x position
        const y = Math.floor(i / (width + 1)) * scale; // Normalized y position

        let z;
        if (chunks.length > 0 && i < width + 1) {
            z = prevEdgeHeights[i]; // Match heights for the first row
        } else {
            z = noise.noise2D(x, y) * 10; // Get noise value and scale it
        }
        positionAttribute.setZ(i, z); // Set the Z-coordinate (height) of each vertex
    }

    // Store the last row's heights for the next chunk
    prevEdgeHeights = Array.from({length: width + 1}, (_, i) => 
        positionAttribute.getZ((depth + 1) * (width + 1) - (width + 1) + i)
    );

    positionAttribute.needsUpdate = true;  
}

// Initialize chunks
for (let i = 0; i < numChunks; i++) {
    const chunk = createChunk(i * chunkSize);
    chunks.push(chunk);
}

// Camera setup
camera.position.set(0, 20, 100);  // Set camera position
camera.lookAt(0, 0, 0);  // Look at the center of the terrain

// Track the active camera
let activeCamera = camera;

// Speed of camera movement
const cameraSpeed = 1;

// Toggle debug camera
window.addEventListener('keydown', (event) => {
    if (event.key === 'c') {
        activeCamera = (activeCamera === camera) ? debugCamera : camera; // Toggle between cameras
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move the camera backward
    camera.position.z -= cameraSpeed;

    // Recycle chunks
    const firstChunk = chunks[0];
    const lastChunk = chunks[chunks.length - 1];
    if (lastChunk.position.z - camera.position.z > chunkSize) {
        scene.remove(lastChunk);
        chunks.pop();
        const newChunk = createChunk(firstChunk.position.z - chunkSize);
        chunks.unshift(newChunk);
    }

    // Update debug camera position
    debugCamera.position.x = camera.position.x;
    debugCamera.position.z = camera.position.z;
    debugCamera.lookAt(camera.position.x, 0, camera.position.z); 

    // Render the active camera
    renderer.clear();
    renderer.render(scene, activeCamera);
}



animate();

// Handle window resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    debugCamera.aspect = window.innerWidth / window.innerHeight;
    debugCamera.updateProjectionMatrix();
});
