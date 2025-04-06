//SPDX-License-Identifier:MIT
pragma solidity ^0.8.24;
 
contract MultiSigAccess {
    address public patient; // Patient's address
    mapping(address => bool) public authorizedEntities; // Mapping of authorized doctors/diagnostic centers
    uint256 public requiredApprovals ; 
    mapping(address => bool) public approvers;  
    uint256 public approverCount;  

    event AccessGranted(address indexed entity);
    event AccessRevoked(address indexed entity);
    event ApproverAdded(address indexed approver);
    event ApproverRemoved(address indexed approver);

    modifier onlyStudent() {
        require(msg.sender == patient, "Only the student can perform this action");
        _;
    }

    modifier onlyApprover() {
        require(approvers[msg.sender], "Only an approver can perform this action");
        _;
    }

    constructor(uint256 _requiredApprovals) {
        patient = msg.sender; // Set the patient as the contract deployer
        requiredApprovals = _requiredApprovals;
    }

    // Add an approver (e.g., trusted family member or legal representative)
    function addApprover(address _approver) external onlyStudent() {
        require(!approvers[_approver], "Approver already exists");
        approvers[_approver] = true;
        approverCount++;
        emit ApproverAdded(_approver);
    }

    // Remove an approver
    function removeApprover(address _approver) external onlyStudent() {
        require(approvers[_approver], "Approver does not exist");
        approvers[_approver] = false;
        approverCount--;
        emit ApproverRemoved(_approver);
    }
 
    function grantAccess(address _entity) external onlyApprover {
        require(!authorizedEntities[_entity], "Entity already has access");
        require(approverCount >= requiredApprovals, "Not enough approvals to grant access");
        authorizedEntities[_entity] = true;
        emit AccessGranted(_entity);
    }

    // Revoke access from a doctor or diagnostic center
    function revokeAccess(address _entity) external onlyApprover {
        require(authorizedEntities[_entity], "Entity does not have access");
        authorizedEntities[_entity] = false;
        emit AccessRevoked(_entity);
    }

     
    function hasAccess(address _entity) external view returns (bool) {
        return authorizedEntities[_entity];
    }
}