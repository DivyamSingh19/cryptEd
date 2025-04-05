 
import { ethers } from "ethers";
import dotenv from "dotenv";
import { Request, Response } from "express";
import ExamManagerABI from "../../abi/ExamManager.json"
dotenv.config();
 
 
 
const CONTRACT_ADDRESS = process.env.EXAMMANAGER_ADDRESS as string;
const INFURA_API_KEY = process.env.INFURA_API_KEY as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string; 

 
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const examManagerContract = new ethers.Contract(CONTRACT_ADDRESS, ExamManagerABI.abi, wallet);

 
interface ContractMethodOptions {
  viewFunction?: boolean;
}

     
interface ContractMethodResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Interface for transaction receipt data
interface TransactionReceiptData {
  transactionHash: string;
  blockNumber: number;
}

// Interface for exam data
interface ExamData {
  id: string;
  ipfsHash: string;
  startTime: string;
  endTime: string;
  duration: string;
  isActive: boolean;
}

// Interface for submission data
interface SubmissionData {
  studentId: string;
  ipfsHash: string;
  timestamp: string;
  isSubmitted: boolean;
}

// Interface for result data
interface ResultData {
  studentId: string;
  ipfsHash: string;
  score: string;
  resultHash: string;
  isVerified: boolean;
}

// Helper function to handle contract interactions
const executeContractMethod = async (
  method: string, 
  params: any[] = [], 
  options: ContractMethodOptions = {}
): Promise<ContractMethodResponse> => {
  try {
    // If the method is a view function (doesn't modify state)
    if (options.viewFunction) {
      const result = await examManagerContract[method](...params);
      return { success: true, data: result };
    } 
    // If the method modifies state (requires transaction)
    else {
      const tx = await examManagerContract[method](...params);
      const receipt = await tx.wait();
      return { 
        success: true, 
        data: { 
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber 
        } as TransactionReceiptData
      };
    }
  } catch (error: any) {
    console.error(`Error executing ${method}:`, error);
    return { success: false, error: error.message };
  }
};

// Export all controller functions
export const examController = {
  createExam: async (req: Request, res: Response): Promise<void> => {
    try {
      const { ipfsHash, encryptionKey, startTime, duration } = req.body;
      
      // Validate input
      if (!ipfsHash || !encryptionKey || !startTime || !duration) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }

      const result = await executeContractMethod(
        'createExam',
        [ipfsHash, encryptionKey, startTime, duration]
      );

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deactivateExam: async (req: Request, res: Response): Promise<void> => {
    try {
      const { examId } = req.params;
      
      const result = await executeContractMethod('deactivateExam', [examId]);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Add a verifier
  addVerifier: async (req: Request, res: Response): Promise<void> => {
    try {
      const { verifierAddress } = req.body;
      
      if (!ethers.isAddress(verifierAddress)) {
        res.status(400).json({ success: false, message: 'Invalid Ethereum address' });
        return;
      }
      
      const result = await executeContractMethod('addVerifier', [verifierAddress]);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Remove a verifier
  removeVerifier: async (req: Request, res: Response): Promise<void> => {
    try {
      const { verifierAddress } = req.params;
      
      if (!ethers.isAddress(verifierAddress)) {
        res.status(400).json({ success: false, message: 'Invalid Ethereum address' });
        return;
      }
      
      const result = await executeContractMethod('removeVerifier', [verifierAddress]);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Authorize wallet
  authorizeWallet: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress, studentId } = req.body;
      
      if (!ethers.isAddress(walletAddress) || !studentId) {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid Ethereum address or missing student ID' 
        });
        return;
      }
      
      const result = await executeContractMethod('authorizeWallet', [walletAddress, studentId]);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Revoke wallet authorization
  revokeWalletAuthorization: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      
      if (!ethers.isAddress(walletAddress)) {
        res.status(400).json({ success: false, message: 'Invalid Ethereum address' });
        return;
      }
      
      const result = await executeContractMethod('revokeWalletAuthorization', [walletAddress]);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ------ Student Functions ------

  // Get exam encryption key
  getExamEncryptionKey: async (req: Request, res: Response): Promise<void> => {
    try {
      const { examId } = req.params;
      const { studentWallet } = req.body;  
      
      
      const studentProvider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      const studentWalletPrivateKey = req.body.privateKey;  
      const studentWalletSigner = new ethers.Wallet(studentWalletPrivateKey, studentProvider);
      const contractWithStudentSigner = new ethers.Contract(CONTRACT_ADDRESS, ExamManagerABI.abi, studentWalletSigner);
      
      try {
        const encryptionKey = await contractWithStudentSigner.getExamEncryptionKey(examId);
        res.status(200).json({ success: true, data: encryptionKey });
      } catch (error: any) {
        res.status(403).json({ success: false, error: error.message });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Submit exam
  submitExam: async (req: Request, res: Response): Promise<void> => {
    try {
      const { examId, ipfsHash, studentWalletPrivateKey } = req.body;
      
      if (!examId || !ipfsHash || !studentWalletPrivateKey) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }
      
      // Create a new contract instance with the student's wallet
      const studentProvider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      const studentWalletSigner = new ethers.Wallet(studentWalletPrivateKey, studentProvider);
      const contractWithStudentSigner = new ethers.Contract(CONTRACT_ADDRESS, ExamManagerABI.abi, studentWalletSigner);
      
      try {
        const tx = await contractWithStudentSigner.submitExam(examId, ipfsHash);
        const receipt = await tx.wait();
        
        res.status(200).json({ 
          success: true, 
          data: { 
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber 
          } 
        });
      } catch (error: any) {
        res.status(403).json({ success: false, error: error.message });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ------ Verifier Functions ------

  // Store exam result
  storeResult: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress, examId, ipfsHash, score, verifierKey } = req.body;
      
      if (!walletAddress || !examId || !ipfsHash || score === undefined || !verifierKey) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }
      
      // Create a new contract instance with the verifier's wallet
      const verifierProvider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      const verifierSigner = new ethers.Wallet(verifierKey, verifierProvider);
      const contractWithVerifierSigner = new ethers.Contract(CONTRACT_ADDRESS, ExamManagerABI.abi, verifierSigner);
      
      try {
        const tx = await contractWithVerifierSigner.storeResult(walletAddress, examId, ipfsHash, score);
        const receipt = await tx.wait();
        
        res.status(200).json({ 
          success: true, 
          data: { 
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber 
          } 
        });
      } catch (error: any) {
        res.status(403).json({ success: false, error: error.message });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Verify exam result
  verifyResult: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress, examId, ipfsHash, score, verifierKey } = req.body;
      
      if (!walletAddress || !examId || !ipfsHash || score === undefined || !verifierKey) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }
      
      // Create a new contract instance with the verifier's wallet
      const verifierProvider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      const verifierSigner = new ethers.Wallet(verifierKey, verifierProvider);
      const contractWithVerifierSigner = new ethers.Contract(CONTRACT_ADDRESS, ExamManagerABI.abi, verifierSigner);
      
      try {
        const isValid = await contractWithVerifierSigner.verifyResult(walletAddress, examId, ipfsHash, score);
        
        res.status(200).json({ 
          success: true, 
          data: { 
            isValid
          } 
        });
      } catch (error: any) {
        res.status(403).json({ success: false, error: error.message });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

   
  getExam: async (req: Request, res: Response): Promise<void> => {
    try {
      const { examId } = req.params;
      
      const result = await executeContractMethod(
        'getExam',
        [examId],
        { viewFunction: true }
      );
      
      if (result.success) {
        // Format the response into a more structured object
        const examData: ExamData = {
          id: result.data[0].toString(),
          ipfsHash: result.data[1],
          startTime: result.data[2].toString(),
          endTime: result.data[3].toString(),
          duration: result.data[4].toString(),
          isActive: result.data[5]
        };
        
        res.status(200).json({ success: true, data: examData });
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get submission details
  getSubmission: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress, examId } = req.params;
      
      if (!ethers.isAddress(walletAddress)) {
        res.status(400).json({ success: false, message: 'Invalid Ethereum address' });
        return;
      }
      
      const result = await executeContractMethod(
        'getSubmission',
        [walletAddress, examId],
        { viewFunction: true }
      );
      
      if (result.success) {
        // Format the response into a more structured object
        const submissionData: SubmissionData = {
          studentId: result.data[0],
          ipfsHash: result.data[1],
          timestamp: result.data[2].toString(),
          isSubmitted: result.data[3]
        };
        
        res.status(200).json({ success: true, data: submissionData });
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get result details
  getResult: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress, examId } = req.params;
      
      if (!ethers.isAddress(walletAddress)) {
        res.status(400).json({ success: false, message: 'Invalid Ethereum address' });
        return;
      }
      
      const result = await executeContractMethod(
        'getResult',
        [walletAddress, examId],
        { viewFunction: true }
      );
      
      if (result.success) {
         
        const resultData: ResultData = {
          studentId: result.data[0],
          ipfsHash: result.data[1],
          score: result.data[2].toString(),
          resultHash: result.data[3],
          isVerified: result.data[4]
        };
        
        res.status(200).json({ success: true, data: resultData });
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Check if wallet is authorized
  isWalletAuthorized: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      
      if (!ethers.isAddress(walletAddress)) {
        res.status(400).json({ success: false, message: 'Invalid Ethereum address' });
        return;
      }
      
      const result = await executeContractMethod(
        'isWalletAuthorized',
        [walletAddress],
        { viewFunction: true }
      );
      
      if (result.success) {
        res.status(200).json({ success: true, data: result.data });
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get student ID from wallet
  getStudentIdFromWallet: async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      
      if (!ethers.isAddress(walletAddress)) {
        res.status(400).json({ success: false, message: 'Invalid Ethereum address' });
        return;
      }
      
      const result = await executeContractMethod(
        'getStudentIdFromWallet',
        [walletAddress],
        { viewFunction: true }
      );
      
      if (result.success) {
        res.status(200).json({ success: true, data: result.data });
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

 
export default examController;