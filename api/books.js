import dbConnect from '../lib/dbConnect.js'; // You should have this
import Book from '../models/book.js';

export default async function handler(req, res) {
  await dbConnect(); // connect to MongoDB

  if (req.method === 'GET') {
    try {
      const books = await Book.find().sort({ createdAt: -1 });
      res.status(200).json(books);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve books" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
