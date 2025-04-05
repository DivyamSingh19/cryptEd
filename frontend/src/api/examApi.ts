import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Create Exam
export async function createExam(examData: {
    examId: string;
    encryptionKey: string;
    startTime: string;
    endTime: string;
}) {
    const response = await axios.post(`${BASE_URL}/exam`, examData);
    return response.data;
}

// Deactivate Exam
export async function deactivateExam(examId: string) {
    const response = await axios.put(`${BASE_URL}/exam/${examId}/deactivate`);
    return response.data;
}

// Add Verifier
export async function addVerifier(verifierData: { verifierAddress: string }) {
    const response = await axios.post(`${BASE_URL}/verifier`, verifierData);
    return response.data;
}

// Remove Verifier
export async function removeVerifier(verifierAddress: string) {
    const response = await axios.delete(`${BASE_URL}/verifier/${verifierAddress}`);
    return response.data;
}

// Authorize Wallet
export async function authorizeWallet(walletData: {
    walletAddress: string;
    studentId: string;
}) {
    const response = await axios.post(`${BASE_URL}/wallet/authorize`, walletData);
    return response.data;
}

// Revoke Wallet Authorization
export async function revokeWalletAuthorization(walletAddress: string) {
    const response = await axios.delete(`${BASE_URL}/wallet/authorize/${walletAddress}`);
    return response.data;
}

// Get Exam Encryption Key
export async function getExamEncryptionKey(examId: string) {
    const response = await axios.get(`${BASE_URL}/exam/${examId}/key`);
    return response.data;
}

// Submit Exam
export async function submitExam(submissionData: {
    examId: string;
    walletAddress: string;
    encryptedAnswers: string;
}) {
    const response = await axios.post(`${BASE_URL}/exam/submit`, submissionData);
    return response.data;
}

// Store Result
export async function storeResult(resultData: {
    examId: string;
    walletAddress: string;
    score: number;
    verificationHash: string;
}) {
    const response = await axios.post(`${BASE_URL}/result`, resultData);
    return response.data;
}

// Verify Result
export async function verifyResult(verificationData: {
    examId: string;
    walletAddress: string;
    verificationHash: string;
}) {
    const response = await axios.post(`${BASE_URL}/result/verify`, verificationData);
    return response.data;
}

// Get Exam
export async function getExam(examId: string) {
    const response = await axios.get(`${BASE_URL}/exam/${examId}`);
    return response.data;
}

// Get Submission
export async function getSubmission(walletAddress: string, examId: string) {
    const response = await axios.get(`${BASE_URL}/submission/${walletAddress}/${examId}`);
    return response.data;
}

// Get Result
export async function getResult(walletAddress: string, examId: string) {
    const response = await axios.get(`${BASE_URL}/result/${walletAddress}/${examId}`);
    return response.data;
}

// Check Wallet Authorization
export async function isWalletAuthorized(walletAddress: string) {
    const response = await axios.get(`${BASE_URL}/wallet/authorized/${walletAddress}`);
    return response.data;
}

// Get Student ID from Wallet
export async function getStudentIdFromWallet(walletAddress: string) {
    const response = await axios.get(`${BASE_URL}/wallet/student/${walletAddress}`);
    return response.data;
} 