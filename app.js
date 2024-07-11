const video = document.getElementById('video');
const colorButton = document.getElementById('colorButton');

// Access the device camera and stream to video element
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "user" // Change to "environment" if you want to use the back camera
    }
}).then(stream => {
    console.log("Camera accessed successfully");
    video.srcObject = stream;
}).catch(error => {
    console.error("Error accessing camera: ", error);
    alert("Error accessing camera: " + error.message);
});

// Initialize MediaPipe Hands with the correct locateFile function
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

// Create a canvas to draw the hand detection overlay
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

async function onResults(results) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        for (let i = 0; i < landmarks.length; i++) {
            const x = landmarks[i].x * canvas.width;
            const y = landmarks[i].y * canvas.height;
            ctx.fillStyle = colorButton.style.backgroundColor;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

// Initialize the camera and MediaPipe Hands
const camera = new Camera(video, {
    onFrame: async () => {
        await hands.send({image: video});
    },
    width: 1280,
    height: 720
});
camera.start();

// Handle color picker button click
colorButton.addEventListener('click', () => {
    colorButton.style.backgroundColor = prompt('Enter nail polish color (hex code):', '#FF69B4');
});
