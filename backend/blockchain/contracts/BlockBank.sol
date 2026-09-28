// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract BlockBank {

    address public owner;

    // =========================================================
    // CUSTOMER ACCOUNT
    // =========================================================

    struct CustomerAccount {
        string accountNumber;
        uint256 balance;
        bool active;
        bool exists;
    }

    mapping(string => CustomerAccount) private customerAccounts;

    // =========================================================
    // TRANSACTION
    // =========================================================

    struct Transaction {
        uint256 transactionId;
        string transactionType;
        string senderAccount;
        string receiverAccount;
        uint256 amount;
        string description;
        uint256 timestamp;
    }

    mapping(uint256 => Transaction) private transactions;

    // Customer account -> transaction IDs
    mapping(string => uint256[]) private customerTransactions;

    uint256 private transactionCounter;

    // =========================================================
    // EVENTS
    // =========================================================

    event CustomerAccountCreated(
        string indexed accountNumber,
        uint256 timestamp
    );

    event DepositRecorded(
        uint256 indexed transactionId,
        string indexed accountNumber,
        uint256 amount,
        uint256 newBalance,
        uint256 timestamp
    );

    event WithdrawalRecorded(
        uint256 indexed transactionId,
        string indexed accountNumber,
        uint256 amount,
        uint256 newBalance,
        uint256 timestamp
    );

    event TransferRecorded(
        uint256 indexed transactionId,
        string indexed senderAccount,
        string indexed receiverAccount,
        uint256 amount,
        uint256 timestamp
    );

    // =========================================================
    // MODIFIER
    // =========================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    constructor() {
        owner = msg.sender;
    }

    // =========================================================
    // CREATE CUSTOMER ACCOUNT
    // =========================================================

    function createCustomerAccount(
        string memory accountNumber
    ) public onlyOwner {

        require(
            bytes(accountNumber).length > 0,
            "Account number required"
        );

        require(
            !customerAccounts[accountNumber].exists,
            "Account already exists"
        );

        customerAccounts[accountNumber] = CustomerAccount({
            accountNumber: accountNumber,
            balance: 0,
            active: true,
            exists: true
        });

        emit CustomerAccountCreated(
            accountNumber,
            block.timestamp
        );
    }

    // =========================================================
    // ACTIVATE / DEACTIVATE ACCOUNT
    // =========================================================

    function setAccountStatus(
        string memory accountNumber,
        bool active
    ) public onlyOwner {

        require(
            customerAccounts[accountNumber].exists,
            "Account does not exist"
        );

        customerAccounts[accountNumber].active = active;
    }

    // =========================================================
    // GET BALANCE
    // =========================================================

    function getBalance(
        string memory accountNumber
    ) public view returns (uint256) {

        require(
            customerAccounts[accountNumber].exists,
            "Account does not exist"
        );

        return customerAccounts[accountNumber].balance;
    }

    // =========================================================
    // CHECK ACCOUNT
    // =========================================================

    function accountExists(
        string memory accountNumber
    ) public view returns (bool) {

        return customerAccounts[accountNumber].exists;
    }

    // =========================================================
    // CHECK ACCOUNT STATUS
    // =========================================================

    function isAccountActive(
        string memory accountNumber
    ) public view returns (bool) {

        require(
            customerAccounts[accountNumber].exists,
            "Account does not exist"
        );

        return customerAccounts[accountNumber].active;
    }

    // =========================================================
    // DEPOSIT
    // =========================================================

    function deposit(
        string memory accountNumber,
        uint256 amount,
        string memory description
    )
        public
        onlyOwner
        returns (uint256)
    {

        require(
            customerAccounts[accountNumber].exists,
            "Account does not exist"
        );

        require(
            customerAccounts[accountNumber].active,
            "Account is inactive"
        );

        require(
            amount > 0,
            "Amount must be greater than zero"
        );

        customerAccounts[accountNumber].balance += amount;

        transactionCounter++;

        transactions[transactionCounter] = Transaction({
            transactionId: transactionCounter,
            transactionType: "Deposit",
            senderAccount: "CASHIER",
            receiverAccount: accountNumber,
            amount: amount,
            description: description,
            timestamp: block.timestamp
        });

        customerTransactions[accountNumber].push(
            transactionCounter
        );

        emit DepositRecorded(
            transactionCounter,
            accountNumber,
            amount,
            customerAccounts[accountNumber].balance,
            block.timestamp
        );

        return transactionCounter;
    }

    // =========================================================
    // WITHDRAWAL
    // =========================================================

    function withdraw(
        string memory accountNumber,
        uint256 amount,
        string memory description
    )
        public
        onlyOwner
        returns (uint256)
    {

        require(
            customerAccounts[accountNumber].exists,
            "Account does not exist"
        );

        require(
            customerAccounts[accountNumber].active,
            "Account is inactive"
        );

        require(
            amount > 0,
            "Amount must be greater than zero"
        );

        require(
            customerAccounts[accountNumber].balance >= amount,
            "Insufficient balance"
        );

        customerAccounts[accountNumber].balance -= amount;

        transactionCounter++;

        transactions[transactionCounter] = Transaction({
            transactionId: transactionCounter,
            transactionType: "Withdrawal",
            senderAccount: accountNumber,
            receiverAccount: "CASHIER",
            amount: amount,
            description: description,
            timestamp: block.timestamp
        });

        customerTransactions[accountNumber].push(
            transactionCounter
        );

        emit WithdrawalRecorded(
            transactionCounter,
            accountNumber,
            amount,
            customerAccounts[accountNumber].balance,
            block.timestamp
        );

        return transactionCounter;
    }

    // =========================================================
    // TRANSFER
    // =========================================================

    function transfer(
        string memory senderAccount,
        string memory receiverAccount,
        uint256 amount,
        string memory description
    )
        public
        onlyOwner
        returns (uint256)
    {

        require(
            customerAccounts[senderAccount].exists,
            "Sender account does not exist"
        );

        require(
            customerAccounts[receiverAccount].exists,
            "Receiver account does not exist"
        );

        require(
            customerAccounts[senderAccount].active,
            "Sender account is inactive"
        );

        require(
            customerAccounts[receiverAccount].active,
            "Receiver account is inactive"
        );

        require(
            keccak256(bytes(senderAccount)) !=
            keccak256(bytes(receiverAccount)),
            "Cannot transfer to same account"
        );

        require(
            amount > 0,
            "Amount must be greater than zero"
        );

        require(
            customerAccounts[senderAccount].balance >= amount,
            "Insufficient balance"
        );

        customerAccounts[senderAccount].balance -= amount;

        customerAccounts[receiverAccount].balance += amount;

        transactionCounter++;

        transactions[transactionCounter] = Transaction({
            transactionId: transactionCounter,
            transactionType: "Transfer",
            senderAccount: senderAccount,
            receiverAccount: receiverAccount,
            amount: amount,
            description: description,
            timestamp: block.timestamp
        });

        customerTransactions[senderAccount].push(
            transactionCounter
        );

        customerTransactions[receiverAccount].push(
            transactionCounter
        );

        emit TransferRecorded(
            transactionCounter,
            senderAccount,
            receiverAccount,
            amount,
            block.timestamp
        );

        return transactionCounter;
    }

    // =========================================================
    // GET TRANSACTION
    // =========================================================

    function getTransaction(
        uint256 transactionId
    )
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            uint256,
            string memory,
            uint256
        )
    {

        require(
            transactionId > 0 &&
            transactionId <= transactionCounter,
            "Transaction does not exist"
        );

        Transaction memory txn =
            transactions[transactionId];

        return (
            txn.transactionId,
            txn.transactionType,
            txn.senderAccount,
            txn.receiverAccount,
            txn.amount,
            txn.description,
            txn.timestamp
        );
    }

    // =========================================================
    // GET CUSTOMER TRANSACTION IDS
    // =========================================================

    function getCustomerTransactionIds(
        string memory accountNumber
    )
        public
        view
        returns (uint256[] memory)
    {

        require(
            customerAccounts[accountNumber].exists,
            "Account does not exist"
        );

        return customerTransactions[accountNumber];
    }

    // =========================================================
    // GET TRANSACTION COUNT
    // =========================================================

    function getTransactionCount()
        public
        view
        returns (uint256)
    {
        return transactionCounter;
    }
}