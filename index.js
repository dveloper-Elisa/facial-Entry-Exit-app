import express from "express";
import multer from "multer";
import fs from "fs";
import router from "./routes/general_router.js";
import mongoose from "mongoose";
import Checkin from "./model/checkin.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express());

app.use(router);
// import {fileURLToPath} from 'url';

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

// const "public" = express.static(path.join(__dirname, 'public'))
// console.log("public")
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ extended: true, limit: "50mb" }));
const dir = "public/labeled_images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const data = JSON.parse(
      fs.readFileSync("public/labels.json", {
        encoding: "utf-8",
      })
    );
    if (!data.includes(req.body.name)) {
      data.push(req.body.name);
      fs.writeFileSync("public/labels.json", JSON.stringify(data), {
        encoding: "utf-8",
      });
      fs.mkdirSync(dir + "/" + req.body.name);
    }
    cb(null, dir + "/" + req.body.name);
  },
  filename: function (req, file, cb) {
    const names = fs.readdirSync(dir + "/" + req.body.name);
    cb(
      null,
      (++names.length).toString() + "." + file.originalname.split(".")[1]
    );
  },
});

const upload = multer({ storage: storage });

app.post("/images_labels", upload.single("image"), (req, res) => {
  res.send(req.files);
  console.log(JSON.stringify(req.body));
});

app.post("/upload-new", async (req, res) => {
  const data = JSON.parse(
    fs.readFileSync("public/labels.json", {
      encoding: "utf-8",
    })
  );

  if (!data.includes(req.body.name)) {
    data.push(req.body.name);
    fs.mkdirSync(dir + "/" + req.body.name);
    fs.writeFileSync("public/labels.json", JSON.stringify(data), {
      encoding: "utf-8",
    });
  }
  const names = fs.readdirSync(dir + "/" + req.body.name);

  fs.writeFile(
    dir + "/" + req.body.name + "/" + (++names.length).toString() + ".jpg",
    req.body.image.replace(/^data:image\/png;base64,/, ""),
    "base64",
    (err) => {
      if (err) {
        console.log("Error" + " " + err);
      }
    }
  );

  /**
   * recording materials into database
   */

  try {
    const { name, items, sId } = req.body;
    // console.log(name + " " + items);
    try {
      const recordItems = await Checkin.create({
        regNumber: name,
        materials: items,
        status: "in",
        sId,
      });
      if (recordItems) {
        res.json({ message: "Success full checked in" });
      } else {
        res.send({ message: "Not recorded" });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/material/:regNumber", async (req, res) => {
  try {
    const { regNumber } = req.params;

    if (!regNumber) {
      return res
        .status(400)
        .send({ message: "Registration number is required" });
    }

    const data = await Checkin.findOne({ regNumber });

    if (!data || data.length === 0) {
      return res.status(404).send({ message: "Person not checked in" });
    }

    return res.status(200).send(data);
  } catch (error) {
    console.error("Error fetching check-in data:", error);

    return res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});

mongoose
  .connect(
    process.env.CONNECTION_STRING_DB ||
      "mongodb://127.0.0.1:27017/final-year-project"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => console.log(`server running on ${PORT} .....`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
