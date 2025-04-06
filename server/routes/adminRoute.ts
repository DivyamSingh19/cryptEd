import express, { NextFunction } from "express"
import { Request,Response } from "express";

import { loginAdmin } from "../controllers/adminAuth/adminAuth";
const adminRouter = express.Router();

adminRouter.post("/login", async (req:Request,res:Response,next:NextFunction) => {
    try {
      await loginAdmin(req,res)
    } catch (error) {
        next()
    }
})
 


export default adminRouter