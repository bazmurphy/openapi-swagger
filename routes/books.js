const express = require("express");
const router = express.Router();

// Here we specify a REUSABLE Schema "Book"
// and a REUSABLE Parameter "BookId"
// (that we can use later in our Routes)
/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *        - title
 *        - author
 *      properties:
 *        id:
 *          type: string
 *          description: the generated id of the book
 *        title:
 *          type: string
 *          description: the title of the book
 *        author:
 *          type: string
 *          description: the author of the book
 *      example:
 *        id: 0
 *        title: Example Title
 *        author: Example Author
 *  parameters:
 *    BookId:
 *      in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: The Book id
 *
 */

// We can GROUP our Requests using TAGS (that we can use later in our Routes)
/**
 * @swagger
 * tags:
 *  name: Books
 *  description: Everything related to Books
 */

// Here we specify the Route (and refer to the Schema and/or Parameters)
/**
 * @swagger
 * /books:
 *  get:
 *    summary: Get a list of all Books
 *    tags: [Books]
 *    responses:
 *      200:
 *        description: We receive a list of all the Books
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Book"
 *      500:
 *        description: Server Error
 */

router.get("/", (req, res) => {
  try {
    const books = req.app.db.books;
    res.send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /books/{id}:
 *  get:
 *    summary: Get a specific Book by id
 *    tags: [Books]
 *    parameters:
 *      - $ref: "#/components/parameters/BookId"
 *    responses:
 *      200:
 *        description: We recieve a Book by id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The Book with that specific id was not found
 *      500:
 *        description: Server Error
 */

router.get("/:id", (req, res) => {
  try {
    const books = req.app.db.books;
    const indexOfBook = books.findIndex(
      (book) => book.id === Number(req.params.id)
    );
    if (indexOfBook === -1) {
      res.sendStatus(404);
      return;
    }
    const book = books[indexOfBook];
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /books:
 *  post:
 *    summary: Create a new Book
 *    tags: [Books]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Book"
 *    responses:
 *      200:
 *        description: The Book was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Book"
 *      500:
 *        description: Server Error
 */

router.post("/", (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title && !author) {
      res.sendStatus(400);
      return;
    }
    const books = req.app.db.books;
    let id;
    if (books.length > 0) {
      id = books[books.length - 1].id + 1;
    } else {
      id = 1;
    }
    const book = {
      id: id,
      title: title,
      author: author,
    };
    books.push(book);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update a specific Book by id
 *    tags: [Books]
 *    parameters:
 *      - $ref: "#/components/parameters/BookId"
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Book"
 *    responses:
 *      200:
 *        description: The Book was successfully Updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Book"
 *      400:
 *        description: The Request Body did not include all required fields
 *      404:
 *        description: The Book with that specific id was not found
 *      500:
 *        description: Server Error
 */

router.put("/:id", (req, res) => {
  try {
    if (!req.body) {
      res.sendStatus(400);
      return;
    }

    const { title, author } = req.body;
    if (!title && !author) {
      res.sendStatus(400);
      return;
    }

    const books = req.app.db.books;
    const indexOfBook = books.findIndex(
      (book) => book.id === Number(req.params.id)
    );
    if (indexOfBook === -1) {
      res.sendStatus(404);
      return;
    }

    books[indexOfBook] = {
      id: books[indexOfBook].id,
      title: title ? title : books[indexOfBook].title,
      author: author ? author : books[indexOfBook].author,
    };

    res.send(books[indexOfBook]);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /books/{id}:
 *  delete:
 *    summary: Delete a specific Book by id
 *    tags: [Books]
 *    parameters:
 *      - $ref: "#/components/parameters/BookId"
 *    responses:
 *      200:
 *        description: The Book was successfully Deleted
 *      404:
 *        description: The Book with that specific id was not found
 *      500:
 *        description: Server Error
 */

router.delete("/:id", (req, res) => {
  try {
    const books = req.app.db.books;
    const indexOfBook = books.findIndex(
      (book) => book.id === Number(req.params.id)
    );
    if (indexOfBook === -1) {
      res.sendStatus(404);
      return;
    }
    books.splice(indexOfBook, 1);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
