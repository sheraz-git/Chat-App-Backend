const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const Port = process.env.PORT;
const connectToMongo=require("./db/connectDb");
const userRoutes=require("./routes/user.routes");
const authRoutes=require("./routes/auth.routes");
const conversationRoutes=require("./routes/conversation.routes");
const messageRoutes=require("./routes/message.router");
//console.clear();
connectToMongo();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "ChatApp-Worked-Successfully",
  });
});

app.listen(Port, () => {
    console.log(`ChatApp-Backend-Working ${Port}`);
});

app.use("/api",userRoutes,authRoutes,conversationRoutes,messageRoutes, (req, res,next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});


