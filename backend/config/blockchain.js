const { Web3 } = require('web3')

const contractArtifact = require(
    '../blockchain/build/contracts/BlockBank.json'
)

const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL)

const contract = new web3.eth.Contract(
    contractArtifact.abi,
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS
)

const blockchainAccount =
    web3.eth.accounts.privateKeyToAccount(
        process.env.BLOCKCHAIN_PRIVATE_KEY
    )

web3.eth.accounts.wallet.add(blockchainAccount)

const blockchainNetwork =
    process.env.BLOCKCHAIN_NETWORK || 'Unknown'

module.exports = {
    web3,
    contract,
    blockchainAccount,
    blockchainNetwork
}