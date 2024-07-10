const videoElement = document.getElementById('video');
const nailColor = getQueryVariable('color') || '#FF0000';  // Default color if none specified

// Function to get query parameters from URL
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

// Initialize MediaPipe Hands
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Create canvas for drawing
const canvas = document.createElement('canvas');
canvas.id = 'outputCanvas';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
document.body.appendChild(canvas);
const context = canvas.getContext('2d');

hands.onResults((results) => {
    // Resize canvas to match video size
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the video frame
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Draw the nails with the selected color
    results.multiHandLandmarks.forEach((handLandmarks) => {
        handLandmarks.slice(5, 21).forEach((landmark) => {  // Landmarks for fingers
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;
            context.beginPath();
            context.arc(x, y, 10, 0, 2 * Math.PI);
            context.fillStyle = nailColor;
            context.fill();
        });
    });
});

const startVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } }
        });
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
            videoElement.play();
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
        };
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
};

videoElement.addEventListener('play', () => {
    const updateHands = async () => {
        await hands.send({ image: videoElement });
        requestAnimationFrame(updateHands);
    };
    updateHands();
});

startVideo();
