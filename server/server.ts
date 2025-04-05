import express from "express"
import dotenv from "dotenv"
import adminRouter from "./routes/adminRoute"
import examManagerRouter from "./routes/contractRoutes/examManagerRoutes";
const app = express();
const port = 4000;
app.use(express.json())
dotenv.config()

app.use("/api/admin",adminRouter)


app.use("/api/exam-manager",examManagerRouter)


app.listen(port,()=>(console.log("Server started on ",port)))
