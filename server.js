const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { SwaggerTheme } = require("swagger-themes");

const rootRouter = require("./routes/root");
const booksRouter = require("./routes/books");

const PORT = 5000;

const database = {
  books: [
    { id: 1, title: "Book Title 1", author: "Book Author 1" },
    { id: 2, title: "Book Title 2", author: "Book Author 2" },
    { id: 3, title: "Book Title 3", author: "Book Author 3" },
    { id: 4, title: "Book Title 4", author: "Book Author 4" },
  ],
};

// the API definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Books API",
      version: "1.0.0",
      description: "A simple Node Express Books API",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "development",
      },
    ],
  },
  // Here we can use ./routes/*.js to use the JSDocs comments
  // But we also use separate .yaml files
  apis: ["./routes/*.yaml"],
};

// generates a valid json swagger specification in JSON format
const swaggerSpecs = swaggerJsDoc(swaggerOptions);

// set the Swagger UI theme to dark (generates a long custom CSS string)
const swaggerTheme = new SwaggerTheme("v3");
const swaggerThemeOptions = {
  customCss: swaggerTheme.getBuffer("dark"),
};

const app = express();

// for the /docs/ route, serve the Swagger UI, and set it up with provided specification and options
app.use(
  "/docs/",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpecs, swaggerThemeOptions)
);

// attach the db to the app object
app.db = database;

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.use("/", rootRouter);
app.use("/books", booksRouter);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
