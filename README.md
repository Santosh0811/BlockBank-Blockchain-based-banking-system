# 🏦 BlockBank — Blockchain-Based Banking System

<p align="center">
  <strong>🔐 Secure Banking • ⛓️ Smart Contracts • 💾 MongoDB • ⚡ React</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React + Vite">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js + Express">
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Blockchain-Ganache-E4A663?style=for-the-badge&logo=ethereum&logoColor=white" alt="Ganache">
  <img src="https://img.shields.io/badge/Smart%20Contract-Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Development-Localhost%20Only-blue?style=flat-square" alt="Localhost Only">
  <img src="https://img.shields.io/badge/Network-Ganache%205777-orange?style=flat-square" alt="Ganache 5777">
  <img src="https://img.shields.io/badge/Node.js-18%20%7C%2022-green?style=flat-square" alt="Node.js 18 or 22">
</p>

> 🏦 **BlockBank** is a final-year academic project demonstrating how a traditional web banking application can integrate with a Solidity smart contract and an Ethereum-compatible local blockchain.


BlockBank is a blockchain-based banking system developed as a final-year academic project.

The project demonstrates the integration of a traditional web-based banking application with blockchain technology and Solidity smart contracts.

The system uses:

- React + Vite for the frontend
- Node.js + Express.js for the backend
- MongoDB for application data
- Solidity for smart contracts
- Ganache for the local blockchain
- Web3.js for blockchain communication
- Truffle for smart contract compilation and deployment

> ⚠️ **IMPORTANT**
>
> This repository is configured **ONLY for localhost development using Ganache**.
>
> It is intended for academic development, testing, and demonstration.
>
> This repository is **NOT configured for Ethereum Sepolia, Ethereum Mainnet, or production deployment**.

---

# 🧭 Table of Contents

- [Project Overview](#-project-overview)
- [Project Objectives](#-project-objectives)
- [Features](#-features)
- [User Roles](#-user-roles)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Data Architecture](#-data-architecture)
- [Blockchain Architecture](#-blockchain-architecture)
- [How Blockchain Is Used](#-how-blockchain-is-used)
- [Customer Creation](#-customer-creation)
- [Deposit Flow](#-deposit-flow)
- [Withdrawal Flow](#-withdrawal-flow)
- [Transfer Flow](#-transfer-flow)
- [Transaction Status](#-transaction-status)
- [Authentication](#-authentication)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [NVM and Node.js Setup](#-nvm-and-nodejs-setup)
- [Clone Repository](#-clone-repository)
- [MongoDB Setup](#-mongodb-setup)
- [Ganache Setup](#-ganache-setup)
- [Blockchain Setup](#-blockchain-setup)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Complete Startup Flow](#-complete-startup-flow)
- [Switching Node Versions](#-switching-node-versions)
- [Blockchain Verification](#-blockchain-verification)
- [Security](#-security)
- [Important Localhost Limitation](#-important-localhost-limitation)
- [Troubleshooting](#-troubleshooting)
- [Academic Purpose](#-academic-purpose)
- [License](#-license)

---

# 📌 Project Overview

BlockBank is a web-based banking system that combines conventional database technology with blockchain technology.

The application provides different functionality for:

- Admin
- Cashier
- Customer

The project uses MongoDB for application-level information and a Solidity smart contract for blockchain-based account and transaction management.

The main purpose of the project is to demonstrate how blockchain can be integrated with a banking application while keeping sensitive personal information off-chain.

---

# 🎯 Project Objectives

The objectives of BlockBank are:

1. Develop a blockchain-based banking application.
2. Integrate Solidity smart contracts with a web application.
3. Maintain customer account balances on the blockchain.
4. Record blockchain transactions.
5. Store sensitive customer information in MongoDB.
6. Provide role-based access control.
7. Implement secure authentication.
8. Provide banking operations such as:
   - Deposit
   - Withdrawal
   - Transfer
9. Maintain transaction history.
10. Provide blockchain transaction verification.
11. Demonstrate local blockchain development using Ganache.

---

# ✨ Features

## 👨‍💼 Admin Portal

- Admin login
- Admin dashboard
- Manage customers
- Manage cashiers
- View customer information
- View cashier information
- View all transactions
- Search transactions
- Filter transactions
- View transaction details
- View blockchain transaction information
- View transaction hash
- View block number
- Verify blockchain transaction information

## 🧾 Cashier Portal

- Cashier login
- Cashier dashboard
- Create customer
- Manage customers
- Manage customer KYC
- Deposit money
- Withdraw money
- View customer information
- View transactions
- Process banking operations

## 👤 Customer Portal

- Customer login
- Email verification
- Login OTP
- View profile
- View account information
- View account balance
- Transfer money
- View transaction history
- Change password
- View transaction details

---

# 👥 User Roles

The system has three main roles:

```text
                         BlockBank
                            |
             ┌──────────────┼──────────────┐
             |              |              |
           Admin          Cashier       Customer
             |              |              |
        Management       Banking          Banking
        Functions        Operations       Operations
```

---

# 🧰 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| ⚛️ React | Frontend UI |
| ⚡ Vite | Development server and build tool |
| 🎨 Tailwind CSS | Styling |
| 🧩 React Icons | Icons |
| 📡 Axios | API requests |
| 🔔 React Hot Toast | Notifications |

## Backend

| Technology | Purpose |
|---|---|
| 🟢 Node.js | Backend runtime |
| 🚂 Express.js | REST API |
| 🍃 MongoDB | Database |
| 🦫 Mongoose | MongoDB ODM |
| 🔒 bcryptjs | Password hashing |
| 🎟️ JWT | Authentication |
| 🍪 cookie-parser | HTTP cookie handling |
| 🌐 CORS | Cross-origin requests |
| 📧 Nodemailer | Email and OTP |
| 🌉 Web3.js | Blockchain communication |

## ⛓️ Blockchain

| Technology | Purpose |
|---|---|
| 💎 Solidity | Smart contract |
| 🟢 Ganache | Local blockchain |
| 🧰 Truffle | Compile and deploy contracts |
| 🌉 Web3.js | Blockchain communication |

---

# 🏗️ System Architecture

```text
                         BLOCKBANK
                             |
             ┌───────────────┴───────────────┐
             |                               |
         FRONTEND                         BACKEND
       React + Vite                  Node.js + Express
             |                               |
             |                    ┌──────────┴──────────┐
             |                    |                     |
             |                 MongoDB                Web3.js
             |                    |                     |
             |                    |                  Ganache
             |                    |                     |
             |                    |              Solidity Contract
             |                    |
             └────────────────────┘
```

---

# 🗃️ Data Architecture

BlockBank uses two major storage layers.

## 🍃 MongoDB

MongoDB stores application-level data.

Examples:

```text
Customer
├── Full Name
├── Email
├── Phone
├── Date of Birth
├── Address
├── Password Hash
├── Account Number
├── Account Type
├── Currency
├── KYC Information
├── Account Status
└── Email Verification Status
```

Transaction information can include:

```text
Transaction
├── Transaction ID
├── Sender
├── Receiver
├── Amount
├── Transaction Type
├── Status
├── Description
├── Blockchain Transaction Hash
├── Block Number
└── Blockchain Network
```

## ⛓️ Blockchain

The Solidity smart contract maintains blockchain account state.

Example:

```solidity
struct CustomerAccount {
    string accountNumber;
    uint256 balance;
    bool active;
    bool exists;
}
```

Therefore, the blockchain stores:

```text
Customer Account
├── Account Number
├── Balance
├── Active Status
└── Exists Status
```

Sensitive personal information is kept in MongoDB rather than stored directly on the blockchain.

---

# ⛓️ Blockchain Architecture

The local blockchain architecture is:

```text
Node.js Backend
       |
       | Web3.js
       ↓
Ganache RPC
       |
       ↓
Solidity Smart Contract
       |
       ├── Customer Accounts
       ├── Account Balance
       ├── Account Status
       └── Transactions
```

---

# 🧠 How Blockchain Is Used

The project does not implement its own blockchain algorithm.

The core blockchain mechanism is based on **Solidity smart-contract logic**.

The smart contract manages:

- Customer account creation
- Account status
- Account balance
- Deposits
- Withdrawals
- Transfers
- Transaction records

Ganache provides the local Ethereum-compatible blockchain environment.

Web3.js allows the Node.js backend to communicate with the smart contract.

---

# 👤 Customer Creation

When a cashier creates a customer, information is divided between MongoDB and the blockchain.

## 🍃 MongoDB

Customer application information is stored in MongoDB:

```text
Full Name
Email
Phone
Date of Birth
Address
Password Hash
KYC Information
Account Type
Currency
Account Status
```

## ⛓️ Blockchain

The smart contract stores:

```text
Account Number
Balance
Active Status
Exists Status
```

Example:

```text
MongoDB
-------------------------
Name: Rahul Sharma
Email: rahul@example.com
Phone: 9876543210
KYC: Verified
Password: Hashed
-------------------------

Blockchain
-------------------------
Account: BB100001
Balance: 5000
Active: true
Exists: true
-------------------------
```

---

# 💵 Deposit Flow

```text
Cashier
   ↓
Frontend
   ↓
Backend API
   ↓
Smart Contract
   ↓
Blockchain Balance Updated
   ↓
MongoDB Transaction Record
```

The customer's blockchain account balance is updated through the smart contract.

The transaction information is also stored in MongoDB.

---

# 💸 Withdrawal Flow

```text
Cashier
   ↓
Withdrawal Request
   ↓
Backend
   ↓
Read Blockchain Balance
   ↓
Check Available Balance
   ↓
Smart Contract
   ↓
Blockchain Balance Updated
   ↓
MongoDB Transaction Record
```

The system checks the blockchain balance before processing the withdrawal.

---

# 💳 Transfer Flow

When a customer transfers money:

```text
Customer
    ↓
React Frontend
    ↓
Express API
    ↓
Read Sender Balance
    ↓
Blockchain
    ↓
Check Sufficient Balance
    ↓
Create MongoDB Transaction
Status = Pending
    ↓
Execute Smart Contract
    ↓
Blockchain Transaction
    ↓
Success / Failure
```

If the blockchain transaction succeeds:

```text
MongoDB
Status = Completed

+
Blockchain Hash

+
Block Number
```

If the blockchain transaction fails:

```text
MongoDB
Status = Failed
```

---

# 💰 How the Amount Is Protected

The financial account balance is maintained by the smart contract.

The backend does not simply trust the MongoDB transaction amount when determining the actual blockchain balance.

For example:

```text
Transfer ₹1000
      ↓
Read sender balance from blockchain
      ↓
Check whether balance >= ₹1000
      ↓
Execute smart contract transfer
      ↓
Blockchain updates account state
```

MongoDB stores the application transaction record and blockchain metadata.

The blockchain maintains the authoritative on-chain account balance.

---

# 📊 Transaction Status

Transactions can have the following statuses.

## 🟡 Pending

The transaction has been created in MongoDB but blockchain processing is not yet confirmed.

## 🟢 Completed

The blockchain transaction succeeded and the application successfully recorded the blockchain information.

## 🔴 Failed

The blockchain transaction failed.

---

# 🔐 Authentication

BlockBank uses JWT authentication.

The authentication flow is:

```text
Login
  ↓
Validate Email + Password
  ↓
Generate JWT
  ↓
HTTP-only Cookie
  ↓
Authenticated Request
  ↓
Backend Middleware
  ↓
Role Authorization
```

Roles include:

```text
admin
cashier
customer
```

Passwords are hashed using bcrypt before being stored.

---

# 📧 Email & OTP

Nodemailer is used for email functionality.

Email functionality can be used for:

- Customer account information
- Login OTP
- Email verification
- Banking notifications

SMTP credentials are configured through environment variables.

---

# 📁 Project Structure

```text
BlockBank/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── assets/
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── blockchain/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── blockchain/
│   ├── contracts/
│   ├── migrations/
│   ├── build/
│   ├── truffle-config.js
│   └── package.json
│
└── README.md
```

---

# 💻 Prerequisites

Install the following:

- Git
- Node.js
- NVM
- npm
- MongoDB
- Ganache
- VS Code or another code editor

Recommended Node.js versions:

```text
Node.js 18
Node.js 22
```

NVM is recommended because the project may require switching between Node.js versions.

---

# 🔄 NVM & Node.js Setup

NVM allows multiple Node.js versions to be installed on the same machine.

Check the current Node.js version:

```bash
node -v
```

Check NVM:

```bash
nvm --version
```

List installed Node.js versions:

```bash
nvm list
```

## Install Node.js 18

```bash
nvm install 18
```

Use Node.js 18:

```bash
nvm use 18
```

Verify:

```bash
node -v
```

## Install Node.js 22

```bash
nvm install 22
```

Use Node.js 22:

```bash
nvm use 22
```

Verify:

```bash
node -v
```

---

# 📥 Clone Repository

Clone the GitHub repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project:

```bash
cd BlockBank
```

---

# 🍃 MongoDB Setup

Install MongoDB Community Server.

Start the MongoDB service.

The project uses:

```text
mongodb://localhost:27017/BlockBank
```

No MongoDB Atlas connection is required.

The database is local.

---

# 🟢 Ganache Setup

Open Ganache.

Create or start a local blockchain.

Use:

```text
Host: 127.0.0.1
Port: 7545
Network ID: 5777
```

The local RPC URL is:

```text
http://127.0.0.1:7545
```

Ganache provides development accounts that can be used by the application.

---

# 📜 Blockchain Setup

Navigate to the blockchain directory:

```bash
cd blockchain
```

Install dependencies:

```bash
npm install
```

Compile the smart contract:

```bash
truffle compile
```

Deploy the smart contract:

```bash
truffle migrate --network development
```

To completely redeploy:

```bash
truffle migrate --reset --network development
```

After deployment, copy the generated contract address.

Update the backend `.env` file:

```env
BLOCKCHAIN_CONTRACT_ADDRESS=YOUR_GANACHE_CONTRACT_ADDRESS
```

---

# ⚙️ Truffle Configuration

The development network is configured for Ganache:

```javascript
module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 7545,
            network_id: '5777'
        }
    },

    compilers: {
        solc: {
            version: '0.8.21',
            settings: {
                evmVersion: 'paris'
            }
        }
    }
}
```

---

# 🖥️ Backend Setup

Open a new terminal.

Navigate to the backend:

```bash
cd backend
```

## 1️⃣ Select Node.js Version

If the backend requires Node 18:

```bash
nvm use 18
```

Verify:

```bash
node -v
```

Then verify npm:

```bash
npm -v
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Create Backend `.env`

Create:

```text
backend/.env
```

Example:

```env
MONGO_URI=mongodb://localhost:27017/BlockBank

PORT=5001

JWT_SECRET=your_jwt_secret

NODE_ENV=development

SMTP_USER=your_email
SMTP_PASS=your_email_password

BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545

BLOCKCHAIN_CONTRACT_ADDRESS=YOUR_GANACHE_CONTRACT_ADDRESS

BLOCKCHAIN_PRIVATE_KEY=YOUR_GANACHE_PRIVATE_KEY

BLOCKCHAIN_NETWORK=Ganache

FRONTEND_URL=http://localhost:5173

ADMIN_EMAIL=your_admin_email
```

Replace:

```text
YOUR_GANACHE_CONTRACT_ADDRESS
```

with your deployed contract address.

Replace:

```text
YOUR_GANACHE_PRIVATE_KEY
```

with the private key of your Ganache development account.

> ⚠️ Never upload the real `.env` file or private key to GitHub.

## 4️⃣ Start Backend

Run:

```bash
npm run dev
```

If the project uses `npm start`:

```bash
npm start
```

Backend:

```text
http://localhost:5001
```

---

# 🎨 Frontend Setup

Open another terminal.

Navigate to frontend:

```bash
cd frontend
```

Select the required Node.js version:

```bash
nvm use 18
```

Verify:

```bash
node -v
```

Install dependencies:

```bash
npm install
```

---

# 🌐 Frontend Environment Variables

Create:

```text
frontend/.env
```

Add:

```env
VITE_BACKEND_URL_LINK=http://localhost:5001

VITE_ENVIRONMENT_KEY=localhost
```

---

# ▶️ Start Frontend

Run:

```bash
npm run dev
```

Vite will normally start at:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🚀 Complete Project Setup Flow

Follow these steps in order.

## 1. Start MongoDB

```text
MongoDB
localhost:27017
```

## 2. Start Ganache

```text
Ganache
127.0.0.1:7545
Network ID: 5777
```

## 3. Deploy Smart Contract

```bash
cd blockchain

npm install

truffle compile

truffle migrate --network development
```

Copy the deployed contract address.

## 4. Configure Backend

```bash
cd backend

nvm use 18

npm install
```

Create `.env` and configure:

```env
MONGO_URI=mongodb://localhost:27017/BlockBank
PORT=5001
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
BLOCKCHAIN_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
BLOCKCHAIN_PRIVATE_KEY=YOUR_GANACHE_PRIVATE_KEY
BLOCKCHAIN_NETWORK=Ganache
FRONTEND_URL=http://localhost:5173
```

## 5. Start Backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5001
```

## 6. Configure Frontend

```bash
cd frontend

nvm use 18

npm install
```

Create `.env`:

```env
VITE_BACKEND_URL_LINK=http://localhost:5001
VITE_ENVIRONMENT_KEY=localhost
```

## 7. Start Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔁 Switching Node.js Versions

NVM allows you to switch versions without reinstalling the project.

## Node 18 → Node 22

```bash
nvm use 18

node -v

nvm use 22

node -v
```

## Node 22 → Node 18

```bash
nvm use 22

node -v

nvm use 18

node -v
```

## Check Installed Versions

```bash
nvm list
```

## Install Versions If Missing

```bash
nvm install 18
nvm install 22
```

> You do not need to reinstall Node every time you switch versions. Once both versions are installed with NVM, use `nvm use 18` or `nvm use 22`.

---

# 🔐 Environment Variables

## Backend `.env`

```env
MONGO_URI=
PORT=
JWT_SECRET=
NODE_ENV=
SMTP_USER=
SMTP_PASS=
BLOCKCHAIN_RPC_URL=
BLOCKCHAIN_CONTRACT_ADDRESS=
BLOCKCHAIN_PRIVATE_KEY=
BLOCKCHAIN_NETWORK=
FRONTEND_URL=
ADMIN_EMAIL=
```

## Frontend `.env`

```env
VITE_BACKEND_URL_LINK=
VITE_ENVIRONMENT_KEY=
```

---

# 🚫 Protect Your `.env` File

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
.env.development
.env.production
```

Never upload:

- Blockchain private keys
- MongoDB passwords
- JWT secrets
- SMTP passwords
- API keys
- Wallet seed phrases

---

# 🔎 Blockchain Verification

This project uses Ganache.

Ganache is a local blockchain, so local transactions cannot be opened on Sepolia Etherscan.

Do NOT use:

```text
https://sepolia.etherscan.io/tx/TRANSACTION_HASH
```

for Ganache transactions.

Instead, verify local transactions using:

```text
Ganache
   +
Transaction Hash
   +
Block Number
   +
Smart Contract State
   +
BlockBank Transaction Details
```

The application can display:

- Blockchain Transaction ID
- Transaction Type
- Sender Account
- Receiver Account
- Amount
- Block Number
- Timestamp
- Transaction Hash

---

# 🌐 Localhost Network Configuration

| Component | Configuration |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:5001` |
| 🍃 MongoDB | `mongodb://localhost:27017/BlockBank` |
| Blockchain | 🟢 Ganache |
| RPC | `http://127.0.0.1:7545` |
| Network ID | `5777` |
| Blockchain Network | 🟢 Ganache |

---

# 🛡️ Security

The project implements several security mechanisms.

## Password Hashing

Passwords are hashed with bcrypt.

```text
Plain Password
      ↓
bcrypt
      ↓
Password Hash
      ↓
MongoDB
```

## 🎟️ JWT Authentication

JWT is used for authenticated requests.

The JWT is stored in an HTTP-only cookie.

## Role Authorization

Backend APIs are protected according to the user's role.

```text
Admin
Cashier
Customer
```

## 🔒 Sensitive Information

Sensitive personal information is stored in MongoDB instead of the blockchain.

## ⛓️ Blockchain Account State

Account balance and blockchain account state are maintained by the smart contract.

---

# ⚠️ Important Localhost Limitation

This repository is specifically for:

```text
React
   ↓
localhost
   ↓
Node.js + Express
   ↓
MongoDB Local
   ↓
Web3.js
   ↓
Ganache
   ↓
Solidity Smart Contract
```

It is NOT configured for:

```text
Ethereum Sepolia
Ethereum Mainnet
Alchemy
MongoDB Atlas
Render
Production infrastructure
Real banking systems
Real money
```

Do not use Ganache private keys for real wallets.

Do not use this project for real financial transactions.

---

# 🧪 Troubleshooting

## 🍃 MongoDB connection failed

Make sure MongoDB is running.

Check:

```env
MONGO_URI=mongodb://localhost:27017/BlockBank
```

---

## Ganache connection failed

Make sure Ganache is running.

Check:

```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
```

---

## Smart contract not found

Redeploy:

```bash
truffle migrate --reset --network development
```

Then update:

```env
BLOCKCHAIN_CONTRACT_ADDRESS=NEW_CONTRACT_ADDRESS
```

---

## Frontend cannot connect to backend

Check:

```env
VITE_BACKEND_URL_LINK=http://localhost:5001
```

Make sure the backend is running.

---

## CORS error

Check backend:

```env
FRONTEND_URL=http://localhost:5173
```

Restart the backend after changing `.env`.

---

## ⛓️ Blockchain transaction failed

Check:

1. Ganache is running.
2. RPC URL is correct.
3. Contract is deployed.
4. Contract address is correct.
5. Ganache private key is correct.
6. The backend account exists in Ganache.
7. The account has sufficient test funds.
8. The smart contract is deployed on Network ID `5777`.

---

# 🎓 Academic Purpose

BlockBank is developed as a final-year academic project.

The project demonstrates the integration of:

- React
- REST APIs
- Node.js
- Express.js
- MongoDB
- Authentication
- Role-based authorization
- Solidity
- Smart contracts
- Ganache
- Web3.js
- Blockchain transaction management

The project demonstrates that blockchain can be integrated with a conventional database architecture rather than replacing the database completely.

---

# ⚠️ Disclaimer

BlockBank is an academic and educational project.

It is intended for:

- Learning
- Development
- Testing
- Demonstration
- Academic evaluation

It is not a real banking platform.

It must not be used to process real money or real financial transactions.

Ganache accounts and blockchain data are local development/test data only.

---

# 👨‍💻 Author

**BlockBank — Blockchain-Based Banking System**

Final-Year Academic Project

---

# 📄 License

This project is intended for academic and educational purposes.
