const express = require("express");
const app = express();
const http = require("http").createServer(app);
require("dotenv").config();
const PORT = process.env.PORT || 3500;
const io = require("socket.io")(http);
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
app.use(
  "/sweetalert2",
  express.static(path.join(__dirname, "node_modules/sweetalert2/dist"))
);
app.use("/", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// API Routes

const routes = require("./routers/index");
app.use("/", routes);
require("./utils/getData");

// Cloudinary storage and workers

require("./config/cloudinary");
require("./services/weeklyReport");
const { emailWorker, reportWorker } = require("./services/worker");

// Scocket Configuration

io.on("connection", socket => {
  socket.on("logout others", status => {
    io.emit("logout others", status); 
  });
  socket.on("logout all", status => {
    io.emit("logout all", status); 
  });
});

http.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
})