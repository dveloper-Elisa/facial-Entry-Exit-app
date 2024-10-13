const imageUpload = document.getElementById("imageUpload");
// const HOST_API = "http://localhost:3001";

const verify = localStorage.getItem("sec");
console.log("hhehe", JSON.parse(verify).id);
if (!verify) {
  window.location = "/";
  // return;
}

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("sec");

  window.location.href = "/"; // Redirect to logout endpoint
});
/**
 * Handlering add item on list
 */

const addbButton = document.getElementById("add-btn");
const itemName = document.getElementById("item-name");
const itemsList = document.getElementById("item-list");

let items = [];
addbButton.addEventListener("click", (e) => {
  e.preventDefault();

  const itemNameValue = itemName.value;
  if (itemNameValue) {
    items.push(itemNameValue);
    displayItems();
    // checkIn(items);
    itemName.value = "";
  }
});

function displayItems() {
  (itemsList.innerHTML = ""),
    items.forEach((material) => {
      const li = document.createElement("li");
      li.innerHTML = material;
      li.classList = "bg-green-500 text-white font-bold p-2 rounded-md rounded";
      itemsList.appendChild(li);
    });
}

// HERE IT WAS THE MODEL

const video = document.querySelector("#pic1");

if (window.navigator) {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { min: 1280 },
        height: { min: 720 },
      },
    })
    .then((mediaStream) => {
      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        video.play();
      };
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
    });
}
const cardFrame = "./12DaysCardFrame.svg";

document.querySelector("#checkin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  takePicture().then(() => {
    checkIn();
  });
});
const canvas = document.createElement("canvas");
async function takePicture() {
  try {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.imageSmoothingQuality = "high";

    // Convert the canvas image to a data URL and display it in an <img> element
    const img = document.querySelector("#captured-img");
    img.src = canvas.toDataURL("image/png");
    console.log(img);

    // You can also download the image or send it to a server
    // For example, to download the image:
    // const link = document.createElement("a");
    // link.href = canvas.toDataURL("image/png");
    // console.log(link);

    // link.download = "captured-image.png";
    // fetch("/upload-new", {
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify({
    //     image: canvas.toDataURL("image/png", 0.5),
    //     name: document.querySelector('input[id="name"]').value,
    //     items: items,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then(console.log);
    // link.click();
    const sId = JSON.parse(localStorage.getItem("sec")).id;
    console.log("sid", sId);
    const upload = await fetch("/upload-new", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        image: canvas.toDataURL("image/png", 0.5),
        name: document.querySelector('input[id="name"]').value,
        items: items,
        sId,
      }),
    });
    if (!upload.ok) {
      throw new Error(`HTTP error! Status: ${upload.status}`);
    }
    const res = await upload.json();
    return res;
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * fetching data and send them to the backend
 */

const regnumber = document.getElementById("name");
// const checkinbtn = document.getElementById("take-pic");

async function checkIn() {
  try {
    let name = regnumber.value;
    const sId = JSON.parse(localStorage.getItem("sec"));
    const data = await fetch("/images_labels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, items, sId: sId.id }),
    });

    if (data) {
      const result = data.json();
      console.log(result);
    } else {
      console.log("no result");
    }
  } catch (error) {
    console.log(error);
  }
}

// checkinbtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   checkIn();
// });
