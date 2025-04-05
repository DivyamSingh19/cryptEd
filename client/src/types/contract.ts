
export type ExamData = {
    examId: string;
    encryptionKey: string;
    startTime: string;
    endTime: string;
}

export type VerifierData = {
    verifierAddress: string;
}

export type WalletData = {
    walletAddress: string;
    studentId: string;
}

export type SubmissionData = {
    examId: string;
    walletAddress: string;
    encryptedAnswers: string;
}

export type ResultData = {
    examId: string;
    walletAddress: string;
    score: number;
    verificationHash: string;
}

export type VerificationData = {
    examId: string;
    walletAddress: string;
    verificationHash: string;
}