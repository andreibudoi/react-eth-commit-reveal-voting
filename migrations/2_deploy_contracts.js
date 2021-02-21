const BallotFactory = artifacts.require("BallotFactory");

module.exports = async function (deployer) {
    await deployer.deploy(BallotFactory);
};
