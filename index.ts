import express from "express";
import { config } from "dotenv";
import cors from "cors";
config();
import router from "./src/routers";
import globalError from "./src/middlewares/errorMiddleware";
import seeding from "./prisma/seeding";
import setLanguage from "./src/middlewares/set-language";

const app = express();

seeding();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));

// Set Localized Language
app.use(setLanguage);

app.use("/api", router);
app.all("*", (req, res, next) => {
  res.status(404).json({status: false, message: `Endpoint not found: ${req.method} ${req.originalUrl}`});
})

app.use(globalError);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
