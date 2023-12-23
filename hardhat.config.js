require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    goerli: {
      url: process.env.ALCHEMY_GOERLI_RPC_URL,
      accounts: [process.env.TEST_PKEY_0, process.env.TEST_PKEY_1]
    }
  }
};
