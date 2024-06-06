const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3500;
const path = require("path");
const cookieParser = require("cookie-parser");

// App Permissions

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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

// Cloudinary storage and workers

require("./config/cloudinary");
const { emailWorker, reportWorker } = require("./services/worker");

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})