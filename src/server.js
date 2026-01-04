import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import routers from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connectDB } from "./config/index.js";
import dotenv from "dotenv";
import { socketInit } from "./services/user.service.js";
import { socketInitialize } from "./helpers/socket.helper.js";
// import { sendSMS } from "./helpers/sms.helper.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { PORT } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB();
// sendSMS(9159734169,"Hello Sabari!")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
socketInit(io);
socketInitialize(io);
app.use("/", routers);

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinAdmin", (adminId) => {
    socket.join(String(adminId));
    console.log("Admin joined room:", adminId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
