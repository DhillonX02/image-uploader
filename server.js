import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from 'path'

const app = express();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "btpoaavw",
  api_key: "366411219559394",
  api_secret: "W8eSXDMRCP73A6dy_ZK4Y_mywL8",
});

mongoose
  .connect(
    "mongodb+srv://sumitmewali2006_db_user:Jaat%40200617@cluster0.hrdtaph.mongodb.net/",
    { dbName: "NodeJs_Mastery_Course" },
  )
  .then(() => console.log("MongoDb connected..!"))
  .catch((err) => console.log(err));

//rendering ejs file
app.get("/", (req, res) => {
  res.render("index.ejs", { url: null });
});

const storage = multer.diskStorage({
  destination: './public/uploads',

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const imageSchema = new mongoose.Schema({
  filename:String,
  public_id:String,
  imgUrl:String
})

const File = mongoose.model("cloudinary",imageSchema)

app.post("/upload", upload.single("file"), async (req, res) => {
    const file = req.file.path
    
    const cloudinaryRes = await cloudinary.uploader.upload(file,{
      folder:"NodeJS_Mastery_Course"
    })

    //save to database
    const db = await File.create({
      filename:file.originalname,
      public_id:cloudinaryRes.public_id,
      imgUrl:cloudinaryRes.secure_url
    })

    res.render("index.ejs",{url:cloudinaryRes.secure_url})

    // res.json({message:'file uploaded Successfully',cloudinaryRes})
});

const port = 5000;
app.listen(port, () => console.log(`server is running on port${port}`));
