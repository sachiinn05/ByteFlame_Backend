const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// CORS config
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // important
};
app.use(cors(corsOptions));

// app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Routes
const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/requests.js");
const userRouter = require("./router/user.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Connect DB and start server
connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(9000, () => {
      console.log("Server listening on port 9000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected..", err);
  });
