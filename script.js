const video = document.getElementById('video');



function webCam() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    }).then(
        (stream) => {
            video.srcObject = stream;
        }
    ).catch(
        (error) => {
            console.log(error);
        }
    );
}


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(webCam);

video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    faceapi.matchDimensions(canvas, { height: video.height, width: video.width });

    setInterval(async () => {
        const detection = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        const resizedWindow = faceapi.resizeResults(detection, {
            height: video.height,
            width: video.width,
        })

        faceapi.draw.drawDetections(canvas, resizedWindow);
        faceapi.draw.drawFaceLandmarks(canvas, resizedWindow);
        console.log(detection);

    }, 100);
})

// webCam();