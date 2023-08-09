const { deployments, getNamedAccounts, network, ethers } = require("hardhat");
const { developmentChains } = require("../helpper-hardhat-config");
const { assert, expect } = require("chai");
describe("marketPlace", function () {
  let deployer, testContract, testNft1, testNft2, tokenID, price, accounts;
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    testContract = await ethers.getContract("nftMarketPlace");
    testNft1 = await ethers.getContract("BasicNft");
    testNft2 = await ethers.getContract("BasicNft2");
    tokenID = 0;
    accounts = await ethers.getSigners();
    const minting1 = await testNft1.mintNft();
    const minting2 = await testNft2.mintNft();
    price = ethers.utils.parseEther("0.01");
    const approvalForMarket = testNft1.approve(testContract.address, tokenID);
  });
  describe("listItem and buyItem", function () {
    it("it will list item in market and will give another user chance to buy nft ", async function () {
      const waitForlistingItem = await testContract.listItem(
        testNft1.address,
        tokenID,
        price
      );
      const buyerConnectedContract = await testContract.connect(accounts[1]);
      const tryToBuyNft = await buyerConnectedContract.buyItem(
        testNft1.address,
        tokenID,
        { value: price }
      );
      const presentOwner = accounts[1].address;
      const changedOwner = await testNft1.ownerOf(tokenID);
      const proccedOfDeployer = await testContract.getProceed(deployer);
      assert.equal(presentOwner, changedOwner.toString());
      assert.equal(proccedOfDeployer.toString(), price);
    });
    it("it will not list your item twice if you will try to relist", async function () {
      const trytolist1 = await testContract.listItem(
        testNft1.address,
        tokenID,
        price
      );
      await expect(
        testContract.listItem(testNft1.address, tokenID, price)
      ).to.be.revertedWith("nftMarketPlace__alreadyListed");
    });
    it("it will revert the listing if you will list with zero price", async function () {
      const price = ethers.utils.parseEther("0.0");
      await expect(
        testContract.listItem(testNft1.address, tokenID, price)
      ).to.be.revertedWith("nftMarketPlace__notZeroPriceNft");
    });
    it("it will rejected your payment if you will not pay enough", async function () {
      const waitForlistingItem = await testContract.listItem(
        testNft1.address,
        tokenID,
        price
      );
      const buyerConnectedContract = await testContract.connect(accounts[1]);
      price = ethers.utils.parseEther("0.001");
      await expect(
        buyerConnectedContract.buyItem(testNft1.address, tokenID, {
          value: price,
        })
      ).to.be.revertedWith("nftMarketPlace__notListedPrice");
    });
    it("if try to listing nft in marketplace by other Accounts it should fail", async function () {
      const user1connectedContract = await testContract.connect(accounts[1]);
      await expect(
        user1connectedContract.listItem(testNft1.address, tokenID, price)
      ).to.be.revertedWith("nftMarketPlace__notOwner");
    });
    it("it should reject listing of nft on market which is not approved", async function () {
      await expect(
        testContract.listItem(testNft2.address, tokenID, price)
      ).to.be.revertedWith("nftMarketPlace__notApprovedByMarketPlace");
    });
    it("it should revert error if we try to buy unlisted nft", async function () {
      const secondNftForMarket = await testNft2.approve(
        testContract.address,
        tokenID
      );
      await expect(
        testContract.buyItem(testNft2.address, tokenID, { value: price })
      ).to.be.revertedWith("nftMarketPlace__notListed");
    });
    it("it should emit event after successful listings", async function () {
      await expect(
        testContract.listItem(testNft1.address, tokenID, price)
      ).to.emit(testContract, "itemListed");
    });
    it("it should emit event after buyItem", async function () {
      const itemListing = await testContract.listItem(
        testNft1.address,
        tokenID,
        price
      );
      const user1connectedContract = await testContract.connect(accounts[1]);
      await expect(
        user1connectedContract.buyItem(testNft1.address, tokenID, {
          value: price,
        })
      ).to.emit(testContract, "itemBought");
    });
  });
  describe("CancelItem", function () {
    it("it will emit event when owner will cancel item from list of marketplace", async function () {
      const listingNft1 = await testContract.listItem(
        testNft1.address,
        tokenID,
        price
      );
      await expect(testContract.cancelItem(testNft1.address, tokenID)).to.emit(
        testContract,
        "itemCanceled"
      );
    });
  });
  describe("updateItem", function () {
    it("it should update the price of item if owner wil update it", async function () {
      const listingNft1 = await testContract.listItem(
        testNft1.address,
        tokenID,
        price
      );
      price = ethers.utils.parseEther("0.8");
      const updatIngItem = await testContract.updateItem(
        testNft1.address,
        tokenID,
        price
      );
      const timeToWatchResponse = await testContract.getListing(
        testNft1.address,
        tokenID
      );
      const newPrice = timeToWatchResponse.price.toString();
      assert.equal(newPrice, price);
    });
    it("it should emit the event after updating the item", async function () {
      const listingNft1 = await testContract.listItem(
        testNft1.address,
        tokenID,
        price
      );
      price = ethers.utils.parseEther("0.8");
      await expect(
        testContract.updateItem(testNft1.address, tokenID, price)
      ).to.emit(testContract, "itemListed");
    });
  });
  describe("wthdraw proceed", function () {
    it("it will allow someone whom nft has been sold to withdraw their money", async function () {
      //listing 🧘‍♀️
      const listingtoMarketPlace = await testContract.listItem(
        testNft1.address,
        tokenID,
        price
      );
      //updating 🙃
      price = ethers.utils.parseEther("1");
      const updateListingToMarketPlace = await testContract.updateItem(
        testNft1.address,
        tokenID,
        price
      );
      //time to buy👩‍⚖️
      const user1connectedContract = await testContract.connect(accounts[0]);
      const tryToBuyNft = await testContract.buyItem(
        testNft1.address,
        tokenID,
        { value: price }
      );
      const balance1 = await testContract.getProceed(deployer).toString();
      //time to withDraw proceed 💰
      const tryToWithdraw = await testContract.withdrawProceed();
      const balance2 = await testContract.getProceed(deployer).toString();
      expect(balance1 < balance2);
    });
    it("it will revert your  withdraw if you have not any proceed", async function () {
      await expect(testContract.withdrawProceed()).to.be.revertedWith(
        "nftMarketPlace__notAnyProceed"
      );
    });
  });
});
