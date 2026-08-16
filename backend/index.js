import express from "express"
import dotenv from "dotenv/config"
import cors from "cors"
import pool from "./src/Config/DBConfig.js";
import userRoutes from "./src/Routes/userRoutes.js"
import cookieParser from "cookie-parser";
import fileRoutes from "./src/Routes/fileRoutes.js"
import protect from "./src/Middlewares/validateRequest.js";
import botRouter from "./src/Routes/botRoutes.js";

const app = express();
const PORT = 3000;

// CORS — allow the Vite dev server to send cookies
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));



app.use(express.json());
app.use(cookieParser())


app.use("/api/users",userRoutes)
app.use("/api/files",protect,fileRoutes)
app.use("/api/bots",botRouter)

// Start the server on port 3000
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});



