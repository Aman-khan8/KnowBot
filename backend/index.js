import express from "express"
import dotenv from "dotenv/config"
import pool from "./src/Config/DBConfig.js";
import userRoutes from "./src/Routes/userRoutes.js"
import cookieParser from "cookie-parser";
import fileRoutes from "./src/Routes/fileRoutes.js"
import protect from "./src/Middlewares/validateRequest.js";

const app = express();
const PORT = 3000;

// Base route that sends a message back to the browser
app.get('/', (req, res) => {
    res.send('Backend server is running successfully!');
});

app.use(express.json());
app.use(cookieParser())


app.use("/api/users",userRoutes)
app.use("/api/files",protect,fileRoutes)

// Start the server on port 3000
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});



