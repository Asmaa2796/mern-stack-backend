const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// env
dotenv.config();
const path = require("path");
const fs = require("fs");
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;
// connect to mongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log('Server running on port 5000'));
}).catch(err => console.error(err));

// middleware
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const allowedOrigin = process.env.FRONTEND_URL;

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static file serving (uploaded images)
app.use('/uploads', express.static('uploads'));
// routes
const bookRoutes = require('./routes/bookRoutes');

// routes middlware
app.use('/api/books', bookRoutes);