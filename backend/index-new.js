import cors from 'cors';
import expressSession from 'express-session';
import dotenv from 'dotenv';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import UserRoute from './routes/UserRoute.js';
import ProductRoute from './routes/ProductRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

dotenv.config();

const prisma = new PrismaClient();
const sessionStore = new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 15 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
);

const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
));

app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: { secure: 'auto', sameSite: 'None', }
}));

// //cors
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

//test api
app.get('/test', (req, res) => {
    try {
      res.status(200).json({ message: 'API is working' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));