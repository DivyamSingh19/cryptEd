const axios = require('axios');

// Base URL configuration
const BASE_URL = 'http://localhost:3000'; // Replace with your actual server URL

// Create Exam
async function createExam(examData) {
    try {
        const response = await axios.post(`${BASE_URL}/exam`, examData);
        return response.data;
    } catch (error) {
        console.error('Error creating exam:', error);
        throw error;
    }
}

// Deactivate Exam
async function deactivateExam(examId) {
    try {
        const response = await axios.put(`${BASE_URL}/exam/${examId}/deactivate`);
        return response.data;
    } catch (error) {
        console.error('Error deactivating exam:', error);
        throw error;
    }
}

// Add Verifier
async function addVerifier(verifierData) {
    try {
        const response = await axios.post(`${BASE_URL}/verifier`, verifierData);
        return response.data;
    } catch (error) {
        console.error('Error adding verifier:', error);
        throw error;
    }
}

// Remove Verifier
async function removeVerifier(verifierAddress) {
    try {
        const response = await axios.delete(`${BASE_URL}/verifier/${verifierAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error removing verifier:', error);
        throw error;
    }
}

// Authorize Wallet
async function authorizeWallet(walletData) {
    try {
        const response = await axios.post(`${BASE_URL}/wallet/authorize`, walletData);
        return response.data;
    } catch (error) {
        console.error('Error authorizing wallet:', error);
        throw error;
    }
}

// Revoke Wallet Authorization
async function revokeWalletAuthorization(walletAddress) {
    try {
        const response = await axios.delete(`${BASE_URL}/wallet/authorize/${walletAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error revoking wallet authorization:', error);
        throw error;
    }
}

// Get Exam Encryption Key
async function getExamEncryptionKey(examId) {
    try {
        const response = await axios.get(`${BASE_URL}/exam/${examId}/key`);
        return response.data;
    } catch (error) {
        console.error('Error getting exam encryption key:', error);
        throw error;
    }
}

// Submit Exam
async function submitExam(submissionData) {
    try {
        const response = await axios.post(`${BASE_URL}/exam/submit`, submissionData);
        return response.data;
    } catch (error) {
        console.error('Error submitting exam:', error);
        throw error;
    }
}

// Store Result
async function storeResult(resultData) {
    try {
        const response = await axios.post(`${BASE_URL}/result`, resultData);
        return response.data;
    } catch (error) {
        console.error('Error storing result:', error);
        throw error;
    }
}

// Verify Result
async function verifyResult(verificationData) {
    try {
        const response = await axios.post(`${BASE_URL}/result/verify`, verificationData);
        return response.data;
    } catch (error) {
        console.error('Error verifying result:', error);
        throw error;
    }
}

// Get Exam
async function getExam(examId) {
    try {
        const response = await axios.get(`${BASE_URL}/exam/${examId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting exam:', error);
        throw error;
    }
}

// Get Submission
async function getSubmission(walletAddress, examId) {
    try {
        const response = await axios.get(`${BASE_URL}/submission/${walletAddress}/${examId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting submission:', error);
        throw error;
    }
}

// Get Result
async function getResult(walletAddress, examId) {
    try {
        const response = await axios.get(`${BASE_URL}/result/${walletAddress}/${examId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting result:', error);
        throw error;
    }
}

// Check Wallet Authorization
async function isWalletAuthorized(walletAddress) {
    try {
        const response = await axios.get(`${BASE_URL}/wallet/authorized/${walletAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error checking wallet authorization:', error);
        throw error;
    }
}

// Get Student ID from Wallet
async function getStudentIdFromWallet(walletAddress) {
    try {
        const response = await axios.get(`${BASE_URL}/wallet/student/${walletAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error getting student ID from wallet:', error);
        throw error;
    }
}

// Example usage of the functions
async function exampleUsage() {
    // Example data for testing
    const examData = {
        examId: "EXAM123",
        encryptionKey: "encrypted_key_here",
        startTime: "2024-03-20T10:00:00Z",
        endTime: "2024-03-20T12:00:00Z"
    };

    const verifierData = {
        verifierAddress: "0x1234567890abcdef1234567890abcdef12345678"
    };

    const walletData = {
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        studentId: "STUDENT123"
    };

    // Example function calls
    try {
        const exam = await createExam(examData);
        console.log('Created exam:', exam);

        const verifier = await addVerifier(verifierData);
        console.log('Added verifier:', verifier);

        const authorized = await authorizeWallet(walletData);
        console.log('Authorized wallet:', authorized);
    } catch (error) {
        console.error('Error in example usage:', error);
    }
}

// Export all functions
module.exports = {
    createExam,
    deactivateExam,
    addVerifier,
    removeVerifier,
    authorizeWallet,
    revokeWalletAuthorization,
    getExamEncryptionKey,
    submitExam,
    storeResult,
    verifyResult,
    getExam,
    getSubmission,
    getResult,
    isWalletAuthorized,
    getStudentIdFromWallet
};
