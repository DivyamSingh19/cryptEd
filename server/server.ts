import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRouter from "./routes/adminRoute";
import examManagerRouter from "./routes/contractRoutes/examManagerRoutes";
import authRouter from "./routes/auth";

const app = express();
const port = 4000;

// Configure CORS
// app.use(
// //   cors({
// //     origin: ["http://localhost:3000", "http://localhost:3001"],
// //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //     credentials: true,
// //   })
// );
app.use(cors())
app.use(express.json());
dotenv.config();

app.use("/api/admin", adminRouter);
app.use("/api/exam-manager", examManagerRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => console.log("Server started on ", port));
