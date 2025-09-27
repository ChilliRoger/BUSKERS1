import { expect } from "chai";
import { ethers } from "hardhat";
import { MockPYUSD } from "../typechain-types";

describe("MockPYUSD", function () {
  let mockPYUSD: MockPYUSD;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MockPYUSD = await ethers.getContractFactory("MockPYUSD");
    mockPYUSD = await MockPYUSD.deploy(owner.address);
    await mockPYUSD.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await mockPYUSD.name()).to.equal("MockPYUSD");
      expect(await mockPYUSD.symbol()).to.equal("MPYUSD");
    });

    it("Should set the correct decimals", async function () {
      expect(await mockPYUSD.decimals()).to.equal(6);
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await mockPYUSD.balanceOf(owner.address);
      const totalSupply = await mockPYUSD.totalSupply();
      expect(ownerBalance).to.equal(totalSupply);
      expect(ownerBalance).to.equal(ethers.parseUnits("1000000", 6));
    });

    it("Should set the correct owner", async function () {
      expect(await mockPYUSD.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow anyone to mint tokens", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await mockPYUSD.connect(addr1).mint(mintAmount);
      
      const balance = await mockPYUSD.balanceOf(addr1.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should allow owner to mint to specific address", async function () {
      const mintAmount = ethers.parseUnits("500", 6);
      await mockPYUSD.mintTo(addr1.address, mintAmount);
      
      const balance = await mockPYUSD.balanceOf(addr1.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should prevent minting to zero address", async function () {
      const mintAmount = ethers.parseUnits("100", 6);
      await expect(
        mockPYUSD.mintTo(ethers.ZeroAddress, mintAmount)
      ).to.be.revertedWith("MockPYUSD: Cannot mint to zero address");
    });

    it("Should prevent minting zero amount", async function () {
      await expect(
        mockPYUSD.mint(0)
      ).to.be.revertedWith("MockPYUSD: Amount must be greater than 0");
    });

    it("Should prevent minting more than 1M tokens at once", async function () {
      const tooMuch = ethers.parseUnits("1000001", 6);
      await expect(
        mockPYUSD.mint(tooMuch)
      ).to.be.revertedWith("MockPYUSD: Cannot mint more than 1M tokens at once");
    });
  });

  describe("Burning", function () {
    it("Should allow burning tokens", async function () {
      const burnAmount = ethers.parseUnits("100", 6);
      await mockPYUSD.burn(burnAmount);
      
      const balance = await mockPYUSD.balanceOf(owner.address);
      const expectedBalance = ethers.parseUnits("999900", 6);
      expect(balance).to.equal(expectedBalance);
    });

    it("Should prevent burning more than balance", async function () {
      const tooMuch = ethers.parseUnits("1000001", 6);
      await expect(
        mockPYUSD.burn(tooMuch)
      ).to.be.revertedWith("MockPYUSD: Insufficient balance to burn");
    });
  });

  describe("ERC20 Functions", function () {
    it("Should transfer tokens correctly", async function () {
      const transferAmount = ethers.parseUnits("100", 6);
      await mockPYUSD.transfer(addr1.address, transferAmount);
      
      const balance = await mockPYUSD.balanceOf(addr1.address);
      expect(balance).to.equal(transferAmount);
    });

    it("Should approve and transferFrom correctly", async function () {
      const transferAmount = ethers.parseUnits("100", 6);
      await mockPYUSD.approve(addr1.address, transferAmount);
      
      const allowance = await mockPYUSD.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(transferAmount);
      
      await mockPYUSD.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      
      const balance = await mockPYUSD.balanceOf(addr2.address);
      expect(balance).to.equal(transferAmount);
    });
  });

  describe("Utility Functions", function () {
    it("Should return correct max supply", async function () {
      const maxSupply = await mockPYUSD.getMaxSupply();
      expect(maxSupply).to.equal(ethers.parseUnits("10000000", 6));
    });
  });
});
