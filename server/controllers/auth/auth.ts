import express from "express"
import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string

async function studentLogin(req: Request, res: Response) {
  try {
    const { email, password , walletAddress } = req.body;

    
    if (!email || !password || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email }
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

 
    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

  
    const token = jwt.sign(
      { id: student.id, email: student.email},
      JWT_SECRET,
       
    );

    
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: student.id,
        name: student.name,
        email: student.email,
        institution: student.institution,
        walletAddress: student.walletAddress,
        token
      }
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

async function studentRegistration(req: Request, res: Response) {
  try {
    const { email, password, name, institution, walletAddress } = req.body;

     
    if (!email || !password || !name || !institution || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: email, password, name, institution, walletAddress"
      });
    }

     
    const existingStudent = await prisma.student.findUnique({
      where: { email }
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email already in use"
      });
    }

     
    const existingWallet = await prisma.student.findUnique({
      where: { walletAddress }
    });

    if (existingWallet) {
      return res.status(409).json({
        success: false,
        message: "Wallet address already in use"
      });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

     
    const newStudent = await prisma.student.create({
      data: {
        email,
        password: hashedPassword,
        name,
        institution,
        walletAddress
      }
    });

  
    const token = jwt.sign(
      { id: newStudent.id, email: newStudent.email},
      JWT_SECRET,
    
    );

 
    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        institution: newStudent.institution,
        walletAddress: newStudent.walletAddress,
        token
      }
    });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

async function professorRegistation(req: Request, res: Response) {
  try {
    const { email, password, name, institution, walletAddress } = req.body;

     
    if (!email || !password || !name || !institution || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: email, password, name, institution, walletAddress"
      });
    }

    
    const existingProfessor = await prisma.professor.findUnique({
      where: { email }
    });

    if (existingProfessor) {
      return res.status(409).json({
        success: false,
        message: "Email already in use"
      });
    }

   
    const existingWallet = await prisma.professor.findUnique({
      where: { walletAddress }
    });

    if (existingWallet) {
      return res.status(409).json({
        success: false,
        message: "Wallet address already in use"
      });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

     
    const newProfessor = await prisma.professor.create({
      data: {
        email,
        password: hashedPassword,
        name,
        institution,
        walletAddress
      }
    });

 
    const token = jwt.sign(
      { id: newProfessor.id, email: newProfessor.email, role: "professor" },
      JWT_SECRET,
      
    );

     
    res.status(201).json({
      success: true,
      message: "Professor registered successfully",
      data: {
        id: newProfessor.id,
        name: newProfessor.name,
        email: newProfessor.email,
        institution: newProfessor.institution,
        walletAddress: newProfessor.walletAddress,
        token
      }
    });
  } catch (error) {
    console.error("Professor registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

async function professorLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
 
    const professor = await prisma.professor.findUnique({
      where: { email }
    });

    if (!professor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    
    const passwordMatch = await bcrypt.compare(password, professor.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

     
    const token = jwt.sign(
      { id: professor.id, email: professor.email, role: "professor" },
      JWT_SECRET,
       
    );

  
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: professor.id,
        name: professor.name,
        email: professor.email,
        institution: professor.institution,
        walletAddress: professor.walletAddress,
        token
      }
    });
  } catch (error) {
    console.error("Professor login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export {studentLogin,studentRegistration,professorLogin,professorRegistation}