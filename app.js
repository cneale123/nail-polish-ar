const videoElement = document.getElementById('video');
const nailColor = getQueryVariable('color') || '#FF0000';  // Default color if none specified

// Function to get query parameters from URL
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] == variable) {
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
    // Draw the nails with the selected color
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    for (let hand of results.multiHandLandmarks) {
        for (let i = 0; i < hand.length; i++) {
            const x = hand[i].x * canvas.width;
            const y = hand[i].y * canvas.height;
            context.beginPath();
            context.arc(x, y, 10, 0, 2 * Math.PI);
            context.fillStyle = nailColor;
            context.fill();
        }
    }

    const displayCanvas = document.createElement('canvas');
    displayCanvas.width = canvas.width;
    displayCanvas.height = canvas.height;
    displayCanvas.getContext('2d').drawImage(canvas, 0, 0);

    document.body.appendChild(displayCanvas);
});

const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    await hands.send({ image: videoElement });
};

startVideo();
