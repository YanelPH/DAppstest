require("@nomicfoundation/hardhat-toolbox");

// Create a task called account that will list the accounts that we get
// from our hardhat node and the balances each account holds currently

task(
  "accounts",
  "Prints the list of accounts and their balances",
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      const balance = await account.getBalance();
      console.log(account.address, ": ", balance);
    }
  }
);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    sources: "./contracts",
    artifacts: "./src/artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainID: 1337,
    },
    goerli: {
      url: "https://goerli-testnet-node-url.com",
      // accounts
    },
  },
};
