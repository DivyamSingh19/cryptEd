import { studentRegistration,studentLogin,professorLogin,professorRegistation } from "../controllers/auth/auth";
import express, { NextFunction } from "express"
import { Request,Response } from "express";
const authRouter =  express.Router()


authRouter.post("/login-student",async (req:Request,res:Response,next:NextFunction)=>{
    try {
        studentLogin(req,res)
        
    } catch (error) {
        next()
    }
})

authRouter.post("/login-professor",async(req:Request,res:Response,next:NextFunction)=>{
    try {
        professorLogin(req,res)
    } catch (error) {
        next()
    }
})
authRouter.post("/register-professor",async(req:Request,res:Response,next:NextFunction)=>{
    try {
        professorRegistation(req,res)
    } catch (error) {
        next()
    }
})
authRouter.post("/register-student",async(req:Request,res:Response,next:NextFunction)=>{
    try {
        studentRegistration(req,res)
    } catch (error) {
        next()
    }
})

export default authRouter