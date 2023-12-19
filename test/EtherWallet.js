const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EtherWallet", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const EtherWallet = await ethers.getContractFactory("EtherWallet");
    const etherWallet = await EtherWallet.deploy();

    return { etherWallet, owner, otherAccount };
  }
  describe("Deployment", () => {
    it("Should deploy and set the owner to be the deployer address", async () => {
      const { etherWallet, owner } = await loadFixture(deployFixture);
      expect(await etherWallet.owner()).to.equal(owner.address);
    });
  });
  describe("Deposit", () => {});
  describe("Withdrawal", () => {});
});
