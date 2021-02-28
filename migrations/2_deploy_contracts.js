const PollFactory = artifacts.require("PollFactory");

module.exports = async function (deployer) {
    await deployer.deploy(PollFactory);
};
