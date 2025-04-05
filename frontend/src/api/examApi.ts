import axios from 'axios';

 
interface ExamData {
    examId: string;
    encryptionKey: string;
    startTime: string;
    endTime: string;
}

interface VerifierData {
    verifierAddress: string;
}

interface WalletData {
    walletAddress: string;
    studentId: string;
}

interface SubmissionData {
    examId: string;
    walletAddress: string;
    encryptedAnswers: string;
}

interface ResultData {
    examId: string;
    walletAddress: string;
    score: number;
    verificationHash: string;
}

interface VerificationData {
    examId: string;
    walletAddress: string;
    verificationHash: string;
}

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create Exam
export const createExam = async (examData: ExamData) => {
    try {
        const response = await api.post('/exam', examData);
        return response.data;
    } catch (error) {
        console.error('Error creating exam:', error);
        throw error;
    }
};

// Deactivate Exam
export const deactivateExam = async (examId: string) => {
    try {
        const response = await api.put(`/exam/${examId}/deactivate`);
        return response.data;
    } catch (error) {
        console.error('Error deactivating exam:', error);
        throw error;
    }
};

// Add Verifier
export const addVerifier = async (verifierData: VerifierData) => {
    try {
        const response = await api.post('/verifier', verifierData);
        return response.data;
    } catch (error) {
        console.error('Error adding verifier:', error);
        throw error;
    }
};

// Remove Verifier
export const removeVerifier = async (verifierAddress: string) => {
    try {
        const response = await api.delete(`/verifier/${verifierAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error removing verifier:', error);
        throw error;
    }
};

// Authorize Wallet
export const authorizeWallet = async (walletData: WalletData) => {
    try {
        const response = await api.post('/wallet/authorize', walletData);
        return response.data;
    } catch (error) {
        console.error('Error authorizing wallet:', error);
        throw error;
    }
};

// Revoke Wallet Authorization
export const revokeWalletAuthorization = async (walletAddress: string) => {
    try {
        const response = await api.delete(`/wallet/authorize/${walletAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error revoking wallet authorization:', error);
        throw error;
    }
};

// Get Exam Encryption Key
export const getExamEncryptionKey = async (examId: string) => {
    try {
        const response = await api.get(`/exam/${examId}/key`);
        return response.data;
    } catch (error) {
        console.error('Error getting exam encryption key:', error);
        throw error;
    }
};

// Submit Exam
export const submitExam = async (submissionData: SubmissionData) => {
    try {
        const response = await api.post('/exam/submit', submissionData);
        return response.data;
    } catch (error) {
        console.error('Error submitting exam:', error);
        throw error;
    }
};

// Store Result
export const storeResult = async (resultData: ResultData) => {
    try {
        const response = await api.post('/result', resultData);
        return response.data;
    } catch (error) {
        console.error('Error storing result:', error);
        throw error;
    }
};

// Verify Result
export const verifyResult = async (verificationData: VerificationData) => {
    try {
        const response = await api.post('/result/verify', verificationData);
        return response.data;
    } catch (error) {
        console.error('Error verifying result:', error);
        throw error;
    }
};

// Get Exam
export const getExam = async (examId: string) => {
    try {
        const response = await api.get(`/exam/${examId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting exam:', error);
        throw error;
    }
};

// Get Submission
export const getSubmission = async (walletAddress: string, examId: string) => {
    try {
        const response = await api.get(`/submission/${walletAddress}/${examId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting submission:', error);
        throw error;
    }
};

// Get Result
export const getResult = async (walletAddress: string, examId: string) => {
    try {
        const response = await api.get(`/result/${walletAddress}/${examId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting result:', error);
        throw error;
    }
};

// Check Wallet Authorization
export const isWalletAuthorized = async (walletAddress: string) => {
    try {
        const response = await api.get(`/wallet/authorized/${walletAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error checking wallet authorization:', error);
        throw error;
    }
};

// Get Student ID from Wallet
export const getStudentIdFromWallet = async (walletAddress: string) => {
    try {
        const response = await api.get(`/wallet/student/${walletAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error getting student ID from wallet:', error);
        throw error;
    }
}; 