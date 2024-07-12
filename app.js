console.log("JS started")

import {
    HandLandmarker,
    FilesetResolver
  } from "https://cdn.jsdelinpvr.net/npm/@mediapipe/tasks-vision@0.10.0";

  import {
    HAND_CONNECTIONS
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";

  import {
    drawConnectors,
    drawLandmarks
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
  
  const demosSection = document.getElementById("demos");
  
  let handLandmarker;
  let runningMode = "IMAGE";
  let enableWebcamButton;
  let webcamRunning = false;
  
  // Before we can use HandLandmarker class we must wait for it to finish
  // loading. Machine Learning models can be large and take a moment to
  // get everything needed to run.
  const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );
    handLandmarker = await 
    HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: "IMAGE",
      numHands: 2
    });
    demosSection.classList.remove("invisible");
  };
  createHandLandmarker();
  async function handleClick(event) {
    if (!handLandmarker) {
      console.log("Wait for handLandmarker to load before clicking!");
      return;
    }
  
    if (runningMode === "VIDEO") {
      runningMode = "IMAGE";
      await handLandmarker.setOptions({ runningMode: "IMAGE" });
    }
    // Remove all landmarks drawed before
    const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
    for (var i = allCanvas.length - 1; i >= 0; i--) {
      const n = allCanvas[i];
      n.parentNode.removeChild(n);
    }
}
  
  
  /********************
  /********************************************************************
  // Demo 2: Continuously grab image from webcam stream and detect it.
  ********************************************************************/
  
  const video = document.getElementById("webcam");
  const canvasElement = document.getElementById("output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  
  // Check if webcam access is supported.
  const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it.
  if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
  } else {
    console.warn("getUserMedia() is not supported by your browser");
  }
  
  // Enable the live webcam view and start detection.
  function enableCam(event) {
    if (!handLandmarker) {
      console.log("Wait! handLandmarker not loaded yet.");
      return;
    }
  
    if (webcamRunning === true) {
      webcamRunning = false;
      enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
      webcamRunning = true;
      enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
  
    // getUsermedia parameters.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
      video.addEventListener('click', function() {
        if (facingMode == "user") {
          facingMode = "environment";
        } else {
          facingMode = "user";
        }
       
        constraints = {
          audio: false,
          video: {
            facingMode: facingMode
          }
        } 
       
        navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
          video.srcObject = stream; 
        });
      });
    });
  }
  
  let lastVideoTime = -1;
  let results;
  
  async function predictWebcam() {
    
    canvasElement.style.width = video.videoWidth + 'px';
    canvasElement.style.height = video.videoHeight + 'px';
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
  
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await handLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      results = await handLandmarker.detectForVideo(video, startTimeMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }
  