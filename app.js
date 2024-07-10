const videoElement = document.getElementById('video');
const nailColor = getQueryVariable('color') || '#8c1aff';  // Default color if none specified

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
const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(results => {
    // Create canvas if not already created
    let canvas = document.getElementById('outputCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'outputCanvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        document.body.appendChild(canvas);
    }
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the video frame
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Draw the nails with the selected color
    results.multiHandLandmarks.forEach(handLandmarks => {
        handLandmarks.slice(5, 21).forEach(landmark => {  // Landmarks for fingers
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
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } }
    });
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = () => {
        videoElement.play();
        hands.send({ image: videoElement });
    };
};

startVideo();
