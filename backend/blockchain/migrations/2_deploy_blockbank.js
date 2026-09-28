const BlockBank = artifacts.require('BlockBank')

module.exports = function (deployer) {
    deployer.deploy(BlockBank)
}