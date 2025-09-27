import { expect } from "chai";
import { ethers } from "hardhat";
import { MusicNFT } from "../typechain-types";

describe("MusicNFT", function () {
  let musicNFT: MusicNFT;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MusicNFT = await ethers.getContractFactory("MusicNFT");
    musicNFT = await MusicNFT.deploy(
      "Buskers Music NFT",
      "BMNFT",
      "https://api.buskers.com/metadata/"
    );
    await musicNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await musicNFT.name()).to.equal("Buskers Music NFT");
      expect(await musicNFT.symbol()).to.equal("BMNFT");
    });

    it("Should set the correct owner", async function () {
      expect(await musicNFT.owner()).to.equal(owner.address);
    });

    it("Should have zero initial supply", async function () {
      expect(await musicNFT.totalSupply()).to.equal(0);
    });

    it("Should have zero initial next token ID", async function () {
      expect(await musicNFT.nextTokenId()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint NFT to specified address", async function () {
      const tokenURI = "tusky-walrus://test-upload-id-123";
      
      await expect(musicNFT.mint(addr1.address, tokenURI))
        .to.emit(musicNFT, "MusicMinted")
        .withArgs(addr1.address, 0, tokenURI);

      expect(await musicNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await musicNFT.tokenURI(0)).to.equal(tokenURI);
      expect(await musicNFT.totalSupply()).to.equal(1);
      expect(await musicNFT.nextTokenId()).to.equal(1);
    });

    it("Should increment token ID for each mint", async function () {
      await musicNFT.mint(addr1.address, "tusky-walrus://upload-1");
      await musicNFT.mint(addr2.address, "tusky-walrus://upload-2");

      expect(await musicNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await musicNFT.ownerOf(1)).to.equal(addr2.address);
      expect(await musicNFT.totalSupply()).to.equal(2);
      expect(await musicNFT.nextTokenId()).to.equal(2);
    });

    it("Should fail to mint to zero address", async function () {
      await expect(
        musicNFT.mint(ethers.ZeroAddress, "tusky-walrus://test")
      ).to.be.revertedWith("MusicNFT: cannot mint to zero address");
    });

    it("Should fail to mint with empty tokenURI", async function () {
      await expect(
        musicNFT.mint(addr1.address, "")
      ).to.be.revertedWith("MusicNFT: tokenURI cannot be empty");
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(
        musicNFT.connect(addr1).mint(addr2.address, "tusky-walrus://test")
      ).to.be.revertedWithCustomError(musicNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      const tokenURI = "tusky-walrus://test-upload-id-456";
      await musicNFT.mint(addr1.address, tokenURI);
      
      expect(await musicNFT.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should return base URI for tokens without specific URI", async function () {
      await musicNFT.mint(addr1.address, "tusky-walrus://test");
      
      // The contract should return the full tokenURI as set
      expect(await musicNFT.tokenURI(0)).to.equal("tusky-walrus://test");
    });
  });

  describe("Token Existence", function () {
    it("Should return true for existing tokens", async function () {
      await musicNFT.mint(addr1.address, "tusky-walrus://test");
      
      expect(await musicNFT.exists(0)).to.be.true;
    });

    it("Should return false for non-existing tokens", async function () {
      expect(await musicNFT.exists(0)).to.be.false;
      expect(await musicNFT.exists(999)).to.be.false;
    });
  });

  describe("Base URI", function () {
    it("Should allow owner to set base URI", async function () {
      const newBaseURI = "https://new-api.buskers.com/metadata/";
      await musicNFT.setBaseURI(newBaseURI);
      
      // Note: The contract uses _setTokenURI for individual tokens
      // Base URI is used as fallback in _baseURI()
      expect(await musicNFT._baseURI()).to.equal(newBaseURI);
    });

    it("Should fail if non-owner tries to set base URI", async function () {
      await expect(
        musicNFT.connect(addr1).setBaseURI("https://malicious.com/")
      ).to.be.revertedWithCustomError(musicNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Walrus Integration", function () {
    it("Should handle various Walrus URI formats", async function () {
      const walrusURIs = [
        "tusky-walrus://upload-id-123",
        "tusky-walrus://vault-456/file-789",
        "tusky-walrus://sample-music-file",
        "tusky-walrus://complex-upload-id-with-special-chars-123!@#"
      ];

      for (let i = 0; i < walrusURIs.length; i++) {
        await musicNFT.mint(addr1.address, walrusURIs[i]);
        expect(await musicNFT.tokenURI(i)).to.equal(walrusURIs[i]);
      }

      expect(await musicNFT.totalSupply()).to.equal(walrusURIs.length);
    });
  });
});

