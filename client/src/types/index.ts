// types.ts

export type Student = {
  name: string;
  email: string;
  password: string;
  college: string;
  year: number;
  major: string;
};

export type Professor = {
  name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
};

export type CollegeAdmin = {
  name: string;
  email: string;
  password: string;
  college: string;
  position: string;
};

export enum UserRole {
  STUDENT = "student",
  PROFESSOR = "professor",
  ADMIN = "college_admin",
}

// Add a base user type if needed for logged-in sessions or Redux
export type UserType = {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  role: UserRole;
};

export type UserByRole = Student | Professor | CollegeAdmin;
