const fs = require('fs');
const path = require('path');
const Book = require("../models/book");

// get all books
exports.get_all_books = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve books" });
  }
};

// add book
exports.add_book = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    const { title, category, shortDesc, longDesc, author } = req.body;
    const photo = req.file ? req.file.filename : null;
    const book = new Book({
      title,
      category,
      shortDesc,
      longDesc,
      author,
      photo,
    });
    // save to mongodb
    await book.save();

    console.log("Book saved")
    res.status(200).json(book);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create book" });
  }
};

// PUT | update book
exports.update_book = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, category, shortDesc, longDesc, author } = req.body;
    const newPhoto = req.file ? req.file.filename : null;

    // check the existing book
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // if there's a new photo, delete the old one from uploads folder
    if (newPhoto && book.photo) {
      const oldPath = path.join(__dirname, '..', 'uploads', book.photo);
      fs.unlink(oldPath, (err) => {
        if (err) console.log('Failed to delete old image:', err);
      });
    }

    // update book
    book.title = title;
    book.category = category;
    book.shortDesc = shortDesc;
    book.longDesc = longDesc;
    book.author = author;
    if (newPhoto) book.photo = newPhoto;

    await book.save();
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// book details
exports.book_details = async (req,res) => {
    try {
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({error:'Book not found'});
        res.json(book);
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Failed to retrieve book details'});
    }
}
// delete book
exports.delete_book = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json({ message: "Book deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};