const { ethers, network } = require("hardhat");
const fs = require("fs");
const networkAddress =
  "../nextjs-nft-market-place/constants/networkAddress.json";
const frontEndAbiLocation = "../nextjs-nft-market-place/constants/";

module.exports = async function () {
  if (process.env.UPDATE_FRONTEND) {
    console.log("updating frontend");
    await handleUpdateFontEnd();
    await updateAbi();
  }
};
async function updateAbi() {
  console.log("updating abi");
  const nftMarketPlace = await ethers.getContract("nftMarketPlace");
  fs.writeFileSync(
    `${frontEndAbiLocation}nftMarketPlace.json`,
    nftMarketPlace.interface.format(ethers.utils.FormatTypes.json)
  );
  const basicNft = await ethers.getContract("BasicNft");
  fs.writeFileSync(
    `${frontEndAbiLocation}basicNft.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json)
  );
  const basicNft2 = await ethers.getContract("BasicNft2");
  fs.writeFileSync(
    `${frontEndAbiLocation}basicNft2.json`,
    basicNft2.interface.format(ethers.utils.FormatTypes.json)
  );
}
async function handleUpdateFontEnd() {
  console.log("wahat is going on");
  const nftMarketPlace = await ethers.getContract("nftMarketPlace");
  const chainId = network.config.chainId.toString();
  const contractAddress = JSON.parse(fs.readFileSync(networkAddress, "utf8"));
  if (chainId in contractAddress) {
    if (
      !contractAddress[chainId]["nftMarketPlace"].includes(
        nftMarketPlace.address
      )
    ) {
      contractAddress[chainId]["nftMarketPlace"].push(nftMarketPlace.address);
      console.log("what");
    }
  } else {
    console.log("going through");
    contractAddress[chainId] = { nftMarketPlace: [nftMarketPlace.address] };
  }
  fs.writeFileSync(networkAddress, JSON.stringify(contractAddress));
}

module.exports.tags = ["all", "frontend"];
