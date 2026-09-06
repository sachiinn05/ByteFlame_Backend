require('dotenv').config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http =require("http")
const initializeSocket=require("./utils/socket.js")
const { corsOptions } = require("./utils/cors.js");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
  res.send("ByteFlame API is running");
});


// Routes
const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/requests.js");
const userRouter = require("./router/user.js");
const chatRouter=require("./router/chat.js")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/",chatRouter);
const server=http.createServer(app);
initializeSocket(server);

// Connect DB and start server
connectDB()
  .then(() => {
    console.log("Database connection established..");
    server.listen(process.env.PORT || 9000, () => {
      console.log("Server listening on port " + (process.env.PORT || 9000));
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected..", err);
  });
