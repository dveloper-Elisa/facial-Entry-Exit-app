import express from "express";
import multer from "multer";
import fs from "fs";
import router from "./routes/general_router.js";
import mongoose from "mongoose";
import Checkin from "./model/checkin.js";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const app = express();



const PORT = process.env.PORT || 3001;
// app.use(express());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ extended: true, limit: "50mb" }));
const dir = "public/labeled_images";
app.use(router);

const storage = multer.diskStorage({
  /**
   * 
   * @param {import("express").Request} req 
   * @param {*} file 
   * @param {*} cb 
   */
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

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
const abc = (req, res) => {
  console.log(req.file);
  console.log(req.files);
  if (!req.file) {
    return res.status(400).send({ message: "No image uploaded" });
  }

  console.log("Body:", JSON.stringify(req.body));
  res.send(req.file); // For single upload, it's req.file
}
app.post("/images_labels", upload.single("image"), abc);

// app.post("/upload-new", async (req, res) => {
//   const data = JSON.parse(
//     fs.readFileSync("public/labels.json", {
//       encoding: "utf-8",
//     })
//   );

//   if (!data.includes(req.body.name)) {
//     data.push(req.body.name);
//     fs.mkdirSync(dir + "/" + req.body.name);
//     fs.writeFileSync("public/labels.json", JSON.stringify(data), {
//       encoding: "utf-8",
//     });
//   }
//   const names = fs.readdirSync(dir + "/" + req.body.name);

//   fs.writeFile(
//     dir + "/" + req.body.name + "/" + (++names.length).toString() + ".jpg",
//     req.body.image.replace(/^data:image\/png;base64,/, ""),
//     "base64",
//     (err) => {
//       if (err) {
//         console.log("Error" + " " + err);
//       }
//     }
//   );

//   /**
//    * recording materials into database
//    */

//   try {
//     const { name, items, sId } = req.body;
//     console.log(name + " " + items);
//     try {
//       const recordItems = await Checkin.create({
//         regNumber: name,
//         materials: items,
//         status: "in",
//         sId,
//       });
//       if (recordItems) {
//         res.json({ message: "Success full checked in" });
//       } else {
//         res.send({ message: "Not recorded" });
//       }
//     } catch (error) {
//       res.json({ message: error.message });
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// });

const uploadData = async (req, res) => {
  try {
    const data = JSON.parse(
      fs.readFileSync("public/labels.json", {
        encoding: "utf-8",
      })
    );

    // If the name doesn't exist in the labels.json, add it
    if (!data.includes(req.body.name)) {
      data.push(req.body.name);

      // Ensure directory exists or create it recursively
      fs.mkdirSync(path.join(dir, req.body.name), { recursive: true });

      // Update the labels.json file
      fs.writeFileSync("public/labels.json", JSON.stringify(data), {
        encoding: "utf-8",
      });
    }

    const folderPath = path.join(dir, req.body.name);
    const filesInFolder = fs.readdirSync(folderPath);

    // Strip base64 data prefix before saving the image
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    const imagePath = path.join(folderPath, `${filesInFolder.length + 1}.jpg`);


    fs.writeFileSync(imagePath, base64Data, "base64");
    await insertMaterial(req, res);
  } catch (error) {
    console.log("Error processing request:", error.message);
    res.status(500).json({ message: "Error processing request" });
  }
}
app.post("/upload-new", uploadData);

app.get("/material/:regNumber", async (req, res) => {
  try {
    const { regNumber } = req.params;

    if (!regNumber) {
      return res
        .status(400)
        .send({ message: "Registration number is required" });
    }

    const data = await Checkin.findOne({ regNumber, status:"in" });

    if (!data) {
      return res.status(404).json({ message: "Person not checked in" });
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
      "mongodb+srv://kwizeraelisa77:Elisa.123.@cluster0.zxtpk.mongodb.net/"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.use((req, res) => {
      res.status(404).json({ message: "resource not found!!" });
    });

    app.use((err, req, res, next)=>{
      console.log(err)
    })
    app.listen(PORT, () => console.log(`server running on ${PORT} .....`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

async function insertMaterial(req, res) {
  const { name, items, sId } = req.body;
  console.log(req.url + Math.random(), { name, items, sId })
  try {
    const recordItems = await Checkin.create({
      regNumber: name,
      materials: items,
      status: "in",
      sId,
    });

    if (recordItems) {
      res.json({ message: "Successfully checked in" });
    } else {
      res.status(400).json({ message: "Not recorded" });
    }
  } catch (dbError) {
    console.log("Database error:", dbError.message);
    res.status(500).json({ message: "Database error: " + dbError.message });
  }
}

