import "dotenv/config";
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoDBStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/userRouter.js";
import { localsMiddleware } from "./middleware.js";
import mongoose from "mongoose";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));



const dbUrl =  'mongodb://localhost:27017/wetube'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

app.use(session ({
  name: 'session',
  secret,
  resave: false,
  saveUninitialized : false,
  touchAfter: 24 * 60 * 60,
  store : MongoDBStore.create({
      mongoUrl: dbUrl
  }),
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }

}))


app.use(localsMiddleware);
app.use('/uploads', express.static("uploads"))
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;