const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3500;
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
  session({
    name: "mySession",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 1000,
    }
  })
);

// API Routes

const routes = require("./routers/index");
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})