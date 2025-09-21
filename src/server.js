import express from 'express';
import routers from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connectDB } from './config/index.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const { PORT } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB();

app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

app.use("/", routers);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
