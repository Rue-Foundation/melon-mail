pragma solidity ^0.4.11;

import './AbstractEmail.sol';
import './EmailStorage.sol';

contract PublicEmail is AbstractEmail {

    EmailStorage public emailStorage;

    function PublicEmail() public {
        emailStorage = new EmailStorage();
        emailStorage.addOwner(msg.sender);
    }

    function registerUser(bytes32 usernameHash, string encryptedUsername, string publicKey) public {
        emailStorage.setUsernameHash(usernameHash);

        emailStorage.userRegistered(usernameHash, msg.sender, encryptedUsername, publicKey);
    }

    function sendEmail(address[] recipients, string mailHash, string threadHash, bytes32 threadId) public {
        
        for(uint i = 0; i < recipients.length; ++i) {
            emailStorage.emailSent(tx.origin, recipients[i], mailHash, threadHash, threadId);
        }
    }

    function sendExternalEmail(AbstractEmail externalContractAddress, address[] recipients, string mailHash, string threadHash, bytes32 threadId) public {
        sendEmail(recipients, mailHash, threadHash, threadId);

        AbstractEmail externalEmailContract = AbstractEmail(externalContractAddress);
        externalEmailContract.sendEmail(recipients, mailHash, threadHash, threadId);
    }

    function updateContacts(bytes32 usernameHash, string ipfsHash) public {
        emailStorage.contactsUpdated(usernameHash, ipfsHash);
    }
}