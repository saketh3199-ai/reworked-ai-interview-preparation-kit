import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dns from "dns";
import authRoutes from "./routes/authRoutes.js";
import kitRoutes from "./routes/kitRoutes.js";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();
const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// API START BELOW

app.use("/api/auth", authRoutes);
app.use("/api/kits", kitRoutes);

// API END ABOVE
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`);
});