const videoElement = document.getElementsByClassName('input_video')[0];

async function enableWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (err) {
    console.error("Error accessing webcam: ", err);
  }
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});
camera.start();

function onResults(results) {
  if (!results.multiHandLandmarks) {
    return;
  }
  for (const landmarks of results.multiHandLandmarks) {
    // Drawing the landmarks
    drawConnectors(videoElement, landmarks, HAND_CONNECTIONS,
      { color: '#00FF00', lineWidth: 5 });
    drawLandmarks(videoElement, landmarks, { color: '#FF0000', lineWidth: 2 });
  }
}

// Enable webcam on page load
enableWebcam();
