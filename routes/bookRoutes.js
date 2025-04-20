const express = require("express");
const bookController = require("../controllers/bookController");
const route = express.Router();
const multer = require("multer");

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // store in uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// routes
route.get(["/","/books"], bookController.get_all_books);
route.post("/", upload.single("photo"), bookController.add_book);
route.put("/:id" ,upload.single('photo'), bookController.update_book);
route.get("/:id", bookController.book_details);
route.delete("/:id", bookController.delete_book);
module.exports = route;
