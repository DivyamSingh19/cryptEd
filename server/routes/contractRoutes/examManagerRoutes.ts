 
import express from 'express';
const examManagerRouter = express.Router();
import examController  from '../../controllers/contractControllers/examManger';

 
examManagerRouter.post('/exam', examController.createExam);
examManagerRouter.put('/exam/:examId/deactivate', examController.deactivateExam);
examManagerRouter.post('/verifier', examController.addVerifier);
examManagerRouter.delete('/verifier/:verifierAddress', examController.removeVerifier);
examManagerRouter.post('/wallet/authorize', examController.authorizeWallet);
examManagerRouter.delete('/wallet/authorize/:walletAddress', examController.revokeWalletAuthorization);

 
examManagerRouter.get('/exam/:examId/key', examController.getExamEncryptionKey);
examManagerRouter.post('/exam/submit', examController.submitExam);

 
examManagerRouter.post('/result', examController.storeResult);
examManagerRouter.post('/result/verify', examController.verifyResult);

 
examManagerRouter.get('/exam/:examId', examController.getExam);
examManagerRouter.get('/submission/:walletAddress/:examId', examController.getSubmission);
examManagerRouter.get('/result/:walletAddress/:examId', examController.getResult);
examManagerRouter.get('/wallet/authorized/:walletAddress', examController.isWalletAuthorized);
examManagerRouter.get('/wallet/student/:walletAddress', examController.getStudentIdFromWallet);


export default examManagerRouter;