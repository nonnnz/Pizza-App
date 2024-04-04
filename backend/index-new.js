import cors from "cors";
import expressSession from "express-session";
import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import AddressBookRoute from "./routes/AddressBookRoute.js";
import FoodRoute from "./routes/FoodRoute.js";
import ShoppingCart from "./routes/ShoppingCartRoute.js";
import Order from "./routes/OrderRoute.js";
import Payment from "./routes/PaymentRoute.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import multer from "multer";
import Stripe from "stripe";

dotenv.config();

const prisma = new PrismaClient();
const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 15 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { secure: "auto", sameSite: "None" },
  }),
);

app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(AddressBookRoute);
app.use(FoodRoute);
app.use(ShoppingCart);
app.use(Order);
app.use(Payment);

const stripe = new Stripe("sk_test_...", {
  apiVersion: "2023-10-16",
});

const endpointSecret =
  "whsec_b88602964b2f4bb35a82cef666a86d5e1fe64ab13b27bf18e0a7ab2855c255c3";

//test api
app.get("/test", (req, res) => {
  try {
    res.status(200).json({ message: "API is working" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.use(express.static("public/pizza"));
app.use("/public", express.static("public"));

// const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/pizza");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // Limiting file size to 1 MB
});

app.post("/upload", (req, res) => {
  try {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "MulterError: File too large" });
      } else if (err) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        // Extract relevant file details
        const { originalname, mimetype, size, path } = req.file;

        // Construct file object with details
        const fileDetails = {
          originalname,
          mimetype,
          size,
          path,
        };

        // Send JSON response with file details
        res
          .status(200)
          .json({ message: "File uploaded successfully", file: fileDetails });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
