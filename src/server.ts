import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
//import connectDatabase from "./config/database";
//import mySqlPool from "./config/mysql";
import connectDatabase from "./config/database";
import OtherRouter from "./routes/others";
import UserRouter from "./routes/user";
dotenv.config();

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/user", UserRouter);
app.use("/others", OtherRouter);

// app.use("/", (req: Request, res: Response) => {
//   res.send("Hello, TypeScript + Node.js + Express!");
// });

app.listen(PORT, async () => {
  // mySqlPool.query("SELECT 1").then(() => {
  //   console.log("MYSQL CONNECTED");
  // });
  console.clear();
  await connectDatabase();
  console.log(`Server is running on http://localhost:${PORT}`);
});
