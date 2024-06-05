const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3500;
const session = require("express-session");
const path = require("path");

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
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/icons",
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/font"))
);
app.use("/axios", express.static(path.join(__dirname, "node_modules/axios/dist")));
app.use("/", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// API Routes

const routes = require("./routers/index");
app.use("/", routes);

require("./services/worker");

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})