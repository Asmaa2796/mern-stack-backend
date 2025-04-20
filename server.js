const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// env
dotenv.config();
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

// routes
const bookRoutes = require('./routes/bookRoutes');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static file serving (uploaded images)
app.use('/uploads', express.static('uploads'));

// routes middlware
app.use('/api/books', bookRoutes);