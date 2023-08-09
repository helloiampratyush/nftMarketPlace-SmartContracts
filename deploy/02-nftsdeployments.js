const { network } = require("hardhat");
const { verify } = require("../utils/verify");
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const simpleNft01 = await deploy("BasicNft", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  const simpleNft02 = await deploy("BasicNft2", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  const simpleNft03 = await deploy("BasicNft3", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  const chainId = network.config.chainId;
  if (chainId != 31337) {
    await verify(simpleNft01.address, []);
    await verify(simpleNft02.address, []);
    await verify(simpleNft03.address, []);
  }
};
module.exports.tags = ["all", "simpleNft01", "simpleNft02", "simpleNft03"];
