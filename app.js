const videoElement = document.getElementById('video');

const startVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } }
        });
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
            videoElement.play();
        };
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
};

startVideo();
