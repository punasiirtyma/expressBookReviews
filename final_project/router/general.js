const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to simulate fetching books from a remote source using axios
const fetchBooks = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
  try {
    const bookList = await fetchBooks();
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const bookList = await fetchBooks();
    if (bookList[isbn]) {
      res.status(200).json(bookList[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const bookList = await fetchBooks();
    const result = [];
    for (let bookId in bookList) {
      if (bookList[bookId].author.toLowerCase() === author) {
        result.push(bookList[bookId]);
      }
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const bookList = await fetchBooks();
    const result = [];
    for (let bookId in bookList) {
      if (bookList[bookId].title.toLowerCase() === title) {
        result.push(bookList[bookId]);
      }
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  for (let user of users) {
    if (user.username === username) {
      return res.status(400).json({ message: "Username already exists" });
    }
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
