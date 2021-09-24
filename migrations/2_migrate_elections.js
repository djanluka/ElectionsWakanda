const Elections = artifacts.require("./Elections.sol");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(Elections);
};

