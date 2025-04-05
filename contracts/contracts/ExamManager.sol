// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

 
contract ExamManager {
   
    address public admin;
    mapping(address => bool) public verifiers;
    
    // Exam structure
    struct Exam {
        uint256 id;
        string ipfsHash;      // Hash of the encrypted exam on IPFS
        string encryptionKey; // Encryption key (accessible only to admin and verified students)
        uint256 startTime;    // Exam start timestamp
        uint256 endTime;      // Exam end timestamp
        uint256 duration;     // Exam duration in minutes
        bool isActive;        // Whether the exam is currently active
    }
    
    // Submission structure
    struct Submission {
        address wallet;       // Student's wallet address
        string studentId;     // Student ID from Web2.0 system
        uint256 examId;
        string ipfsHash;      // Hash of the submitted answers on IPFS
        uint256 timestamp;    // Submission timestamp
        bool isSubmitted;     // Whether the exam was submitted
    }
    
    // Result structure
    struct Result {
        address wallet;       // Student's wallet address
        string studentId;     // Student ID from Web2.0 system
        uint256 examId;
        string ipfsHash;      // Hash of the result on IPFS
        uint256 score;        // Score (can be encrypted or in clear depending on your privacy needs)
        bytes32 resultHash;   // Hash of the result for verification
        bool isVerified;      // Whether the result has been verified
    }
    
    // Storage
    uint256 public examCounter;
    mapping(uint256 => Exam) public exams;
    
    // Map student wallet address to their Web2.0 ID
    mapping(address => string) public walletToStudentId;
    
    // Map for authorized wallets (linked to Web2.0 accounts)
    mapping(address => bool) public authorizedWallets;
    
    // Submissions and results mapped by wallet address and exam ID
    mapping(address => mapping(uint256 => Submission)) public submissions;
    mapping(address => mapping(uint256 => Result)) public results;
    
    // Events
    event ExamCreated(uint256 indexed examId, string ipfsHash, uint256 startTime, uint256 endTime);
    event WalletAuthorized(address indexed wallet, string studentId);
    event ExamSubmitted(address indexed wallet, string studentId, uint256 indexed examId, string ipfsHash, uint256 timestamp);
    event ResultStored(address indexed wallet, string studentId, uint256 indexed examId, bytes32 resultHash);
    event ResultVerified(address indexed wallet, string studentId, uint256 indexed examId, bool verified);
    
    // Constructor
    constructor() {
        admin = msg.sender;
    }
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(verifiers[msg.sender] || msg.sender == admin, "Only verifiers can call this function");
        _;
    }
    
    modifier onlyAuthorizedWallet() {
        require(authorizedWallets[msg.sender], "Wallet not authorized");
        _;
    }
    
    // Admin functions
    function addVerifier(address _verifier) external onlyAdmin {
        verifiers[_verifier] = true;
    }
    
    function removeVerifier(address _verifier) external onlyAdmin {
        verifiers[_verifier] = false;
    }
    
    // Function to authorize a wallet (called by admin after Web2.0 verification)
    function authorizeWallet(address _wallet, string memory _studentId) external onlyAdmin {
        authorizedWallets[_wallet] = true;
        walletToStudentId[_wallet] = _studentId;
        emit WalletAuthorized(_wallet, _studentId);
    }
    
    // Function to revoke wallet authorization
    function revokeWalletAuthorization(address _wallet) external onlyAdmin {
        authorizedWallets[_wallet] = false;
    }
    
    function createExam(
        string memory _ipfsHash,
        string memory _encryptionKey,
        uint256 _startTime,
        uint256 _duration
    ) external onlyAdmin returns (uint256) {
        examCounter++;
        uint256 _endTime = _startTime + (_duration * 1 minutes);
        
        exams[examCounter] = Exam({
            id: examCounter,
            ipfsHash: _ipfsHash,
            encryptionKey: _encryptionKey,
            startTime: _startTime,
            endTime: _endTime,
            duration: _duration,
            isActive: true
        });
        
        emit ExamCreated(examCounter, _ipfsHash, _startTime, _endTime);
        return examCounter;
    }
    
    function deactivateExam(uint256 _examId) external onlyAdmin {
        require(exams[_examId].id != 0, "Exam does not exist");
        exams[_examId].isActive = false;
    }
    
    // Student functions
    function getExamEncryptionKey(uint256 _examId) external view onlyAuthorizedWallet returns (string memory) {
        require(exams[_examId].id != 0, "Exam does not exist");
        require(exams[_examId].isActive, "Exam is not active");
        require(block.timestamp >= exams[_examId].startTime, "Exam has not started yet");
        require(block.timestamp <= exams[_examId].endTime, "Exam has ended");
        
        return exams[_examId].encryptionKey;
    }
    
    function submitExam(uint256 _examId, string memory _ipfsHash) external onlyAuthorizedWallet {
        require(exams[_examId].id != 0, "Exam does not exist");
        require(exams[_examId].isActive, "Exam is not active");
        require(block.timestamp >= exams[_examId].startTime, "Exam has not started yet");
        require(block.timestamp <= exams[_examId].endTime, "Exam submission period has ended");
        require(!submissions[msg.sender][_examId].isSubmitted, "Exam already submitted");
        
        string memory studentId = walletToStudentId[msg.sender];
        
        submissions[msg.sender][_examId] = Submission({
            wallet: msg.sender,
            studentId: studentId,
            examId: _examId,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            isSubmitted: true
        });
        
        emit ExamSubmitted(msg.sender, studentId, _examId, _ipfsHash, block.timestamp);
    }
    
    // Verifier functions
    function storeResult(
        address _wallet,
        uint256 _examId,
        string memory _ipfsHash,
        uint256 _score
    ) external onlyVerifier {
        require(exams[_examId].id != 0, "Exam does not exist");
        require(submissions[_wallet][_examId].isSubmitted, "Student did not submit this exam");
        
        string memory studentId = walletToStudentId[_wallet];
        
        // Create hash of the result for verification
        bytes32 resultHash = keccak256(abi.encodePacked(
            _wallet,
            studentId,
            _examId,
            _ipfsHash,
            _score
        ));
        
        results[_wallet][_examId] = Result({
            wallet: _wallet,
            studentId: studentId,
            examId: _examId,
            ipfsHash: _ipfsHash,
            score: _score,
            resultHash: resultHash,
            isVerified: false
        });
        
        emit ResultStored(_wallet, studentId, _examId, resultHash);
    }
    
    function verifyResult(
        address _wallet,
        uint256 _examId,
        string memory _ipfsHash,
        uint256 _score
    ) external onlyVerifier returns (bool) {
        require(results[_wallet][_examId].wallet == _wallet, "Result not found");
        
        string memory studentId = walletToStudentId[_wallet];
        
        // Recreate hash with provided parameters
        bytes32 calculatedHash = keccak256(abi.encodePacked(
            _wallet,
            studentId,
            _examId,
            _ipfsHash,
            _score
        ));
        
        // Compare with stored hash
        bool isValid = (calculatedHash == results[_wallet][_examId].resultHash);
        
        if (isValid) {
            results[_wallet][_examId].isVerified = true;
        }
        
        emit ResultVerified(_wallet, studentId, _examId, isValid);
        return isValid;
    }
    
    // Public view functions
    function getExam(uint256 _examId) external view returns (
        uint256 id,
        string memory ipfsHash,
        uint256 startTime,
        uint256 endTime,
        uint256 duration,
        bool isActive
    ) {
        Exam memory exam = exams[_examId];
        require(exam.id != 0, "Exam does not exist");
        
        return (
            exam.id,
            exam.ipfsHash,
            exam.startTime,
            exam.endTime,
            exam.duration,
            exam.isActive
        );
    }
    
    function getSubmission(address _wallet, uint256 _examId) external view returns (
        string memory studentId,
        string memory ipfsHash,
        uint256 timestamp,
        bool isSubmitted
    ) {
        Submission memory submission = submissions[_wallet][_examId];
        
        return (
            submission.studentId,
            submission.ipfsHash,
            submission.timestamp,
            submission.isSubmitted
        );
    }
    
    function getResult(address _wallet, uint256 _examId) external view returns (
        string memory studentId,
        string memory ipfsHash,
        uint256 score,
        bytes32 resultHash,
        bool isVerified
    ) {
        Result memory result = results[_wallet][_examId];
        
        return (
            result.studentId,
            result.ipfsHash,
            result.score,
            result.resultHash,
            result.isVerified
        );
    }
    
    function isWalletAuthorized(address _wallet) external view returns (bool) {
        return authorizedWallets[_wallet];
    }
    
    function getStudentIdFromWallet(address _wallet) external view returns (string memory) {
        return walletToStudentId[_wallet];
    }
}