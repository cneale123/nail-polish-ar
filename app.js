"use strict";
// Copyright 2023 The MediaPipe Authors.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//      http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var tasks_vision_0_10_0_1 = require("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0");
var demosSection = document.getElementById("demos");
var handLandmarker = undefined;
var runningMode = "IMAGE";
var enableWebcamButton;
var webcamRunning = false;
// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
var createHandLandmarker = function () { return __awaiter(void 0, void 0, void 0, function () {
    var vision;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tasks_vision_0_10_0_1.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm")];
            case 1:
                vision = _a.sent();
                return [4 /*yield*/, tasks_vision_0_10_0_1.HandLandmarker.createFromOptions(vision, {
                        baseOptions: {
                            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                            delegate: "GPU"
                        },
                        runningMode: runningMode,
                        numHands: 2
                    })];
            case 2:
                handLandmarker = _a.sent();
                demosSection.classList.remove("invisible");
                return [2 /*return*/];
        }
    });
}); };
createHandLandmarker();
/********************************************************************
// Demo 1: Grab a bunch of images from the page and detection them
// upon click.
********************************************************************/
// In this demo, we have put all our clickable images in divs with the
// CSS class 'detectionOnClick'. Lets get all the elements that have
// this class.
var imageContainers = document.getElementsByClassName("detectOnClick");
// Now let's go through all of these and add a click event listener.
for (var i = 0; i < imageContainers.length; i++) {
    // Add event listener to the child element whichis the img element.
    imageContainers[i].children[0].addEventListener("click", handleClick);
}
// When an image is clicked, let's detect it and display results!
function handleClick(event) {
    return __awaiter(this, void 0, void 0, function () {
        var allCanvas, i, n, handLandmarkerResult, canvas, cxt, _i, _a, landmarks;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!handLandmarker) {
                        console.log("Wait for handLandmarker to load before clicking!");
                        return [2 /*return*/];
                    }
                    if (!(runningMode === "VIDEO")) return [3 /*break*/, 2];
                    runningMode = "IMAGE";
                    return [4 /*yield*/, handLandmarker.setOptions({ runningMode: "IMAGE" })];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    allCanvas = event.target.parentNode.getElementsByClassName("canvas");
                    for (i = allCanvas.length - 1; i >= 0; i--) {
                        n = allCanvas[i];
                        n.parentNode.removeChild(n);
                    }
                    handLandmarkerResult = handLandmarker.detect(event.target);
                    console.log(handLandmarkerResult.handednesses[0][0]);
                    canvas = document.createElement("canvas");
                    canvas.setAttribute("class", "canvas");
                    canvas.setAttribute("width", event.target.naturalWidth + "px");
                    canvas.setAttribute("height", event.target.naturalHeight + "px");
                    canvas.style =
                        "left: 0px;" +
                            "top: 0px;" +
                            "width: " +
                            event.target.width +
                            "px;" +
                            "height: " +
                            event.target.height +
                            "px;";
                    event.target.parentNode.appendChild(canvas);
                    cxt = canvas.getContext("2d");
                    for (_i = 0, _a = handLandmarkerResult.landmarks; _i < _a.length; _i++) {
                        landmarks = _a[_i];
                        drawConnectors(cxt, landmarks, HAND_CONNECTIONS, {
                            color: "#00FF00",
                            lineWidth: 5
                        });
                        drawLandmarks(cxt, landmarks, { color: "#FF0000", lineWidth: 1 });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/
var video = document.getElementById("webcam");
var canvasElement = document.getElementById("output_canvas");
var canvasCtx = canvasElement.getContext("2d");
// Check if webcam access is supported.
var hasGetUserMedia = function () { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}
// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!handLandmarker) {
        console.log("Wait! objectDetector not loaded yet.");
        return;
    }
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    }
    else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    // getUsermedia parameters.
    var constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}
var lastVideoTime = -1;
var results = undefined;
console.log(video);
function predictWebcam() {
    return __awaiter(this, void 0, void 0, function () {
        var startTimeMs, _i, _a, landmarks;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    canvasElement.style.width = video.videoWidth;
                    ;
                    canvasElement.style.height = video.videoHeight;
                    canvasElement.width = video.videoWidth;
                    canvasElement.height = video.videoHeight;
                    if (!(runningMode === "IMAGE")) return [3 /*break*/, 2];
                    runningMode = "VIDEO";
                    return [4 /*yield*/, handLandmarker.setOptions({ runningMode: "VIDEO" })];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    startTimeMs = performance.now();
                    if (lastVideoTime !== video.currentTime) {
                        lastVideoTime = video.currentTime;
                        results = handLandmarker.detectForVideo(video, startTimeMs);
                    }
                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                    if (results.landmarks) {
                        for (_i = 0, _a = results.landmarks; _i < _a.length; _i++) {
                            landmarks = _a[_i];
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
                    return [2 /*return*/];
            }
        });
    });
}
