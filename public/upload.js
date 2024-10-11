// Promise.all([
//   faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//   faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//   faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
// ]).then(start);

// async function start() {
//   const container = document.createElement("div");
//   container.style.position = "relative";
//   document.body.append(container);
//   const labeledFaceDescriptors = await loadLabeledImages();
//   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
//   let image;
//   let canvas;
//   document.body.append("Loaded");
//   imageUpload.addEventListener("change", async () => {
//     if (image) image.remove();
//     if (canvas) canvas.remove();

//     image = await faceapi.bufferToImage(imageUpload.files[0]);
//     container.append(image);
//     canvas = faceapi.createCanvasFromMedia(image);
//     container.append(canvas);
//     const displaySize = { width: 300, height: 300 };
//     faceapi.matchDimensions(canvas, displaySize);
//     const detections = await faceapi
//       .detectAllFaces(image)
//       .withFaceLandmarks()
//       .withFaceDescriptors();
//     const resizedDetections = faceapi.resizeResults(detections, displaySize);
//     const results = resizedDetections.map((d) =>
//       faceMatcher.findBestMatch(d.descriptor)
//     );
//     console.log(detections);
//     results.forEach((result, i) => {
//       const box = resizedDetections[i].detection.box;
//       const drawBox = new faceapi.draw.DrawBox(box, {
//         label: result.toString(),
//       });
//       drawBox.draw(canvas);
//     });
//   });
// }

// async function loadLabeledImages() {
//   const labels = await fetch("/labels.json").then((res) => res.json());
//   return Promise.all(
//     labels.map(async (label) => {
//       console.log(label);
//       const descriptions = [];
//       for (let i = 1; i <= 2; i++) {
//         const img = await faceapi.fetchImage(
//           `/labeled_images/${label}/${i}.jpg`
//         );
//         const detections = await faceapi
//           .detectSingleFace(img)
//           .withFaceLandmarks()
//           .withFaceDescriptor();
//         if (detections?.descriptor) descriptions.push(detections.descriptor);
//       }

//       return new faceapi.LabeledFaceDescriptors(label, descriptions);
//     })
//   );
// }

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
]).then(start);

async function start() {
  const video = document.getElementById("video");
  const captureButton = document.getElementById("capture");
  const container = document.createElement("div");
  container.style.position = "relative";
  document.body.append(container);

  // Access the camera
  navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
    video.srcObject = stream;
  });

  const labeledFaceDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  let canvas;
  document.body.append("Loaded");

  captureButton.addEventListener("click", async () => {
    if (canvas) canvas.remove();

    canvas = faceapi.createCanvasFromMedia(video);
    container.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    );
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const id = result.toString().split(" ")[0];
      getMaterial(id);
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result.toString(),
      });
      drawBox.draw(canvas);
    });
  });
}

async function getMaterial(data) {
  const materials = await fetch(`/material/${data}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (materials) {
    const allTools = await materials.json();
    console.log("tools" + " " + JSON.stringify(allTools));
    const h3 = document.createElement("h3");
    const ol = document.createElement("ol");
    h3.innerText = allTools.regNumber;

    allTools.materials.map((data, i) => {
      const li = document.createElement("li");
      li.innerText = data;
      ol.append(li);
    });
    const div = document.getElementById("data");
    div.append(h3);
    div.append(ol);
    div.innerHTML += div;
  }
}

async function loadLabeledImages() {
  const labels = await fetch("/labels.json").then((res) => res.json());
  return Promise.all(
    labels.map(async (label) => {
      console.log(label);
      const descriptions = [];
      for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(
          `/labeled_images/${label}/${i}.jpg`
        );
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detections?.descriptor) descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}
