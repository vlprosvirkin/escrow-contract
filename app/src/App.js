import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import EscrowContract from './artifacts/contracts/Escrow.sol/Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    window.ethereum.on('accountsChanged', async function (accounts) {
      // accounts[0] is the new selected account in MetaMask
      setAccount(accounts[0]);
      document.getElementById("connectedWallet").value = accounts[0];
    });
  }, []);

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      setAccount(accounts[0]);
    };
  
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  
    // Clean up the event listener
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;

    // get value from textBox to convert to wei
    const textBoxValue = document.getElementById('ethValue').value;
    const value = ethers.utils.parseEther(textBoxValue);

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  async function loadEscrow() {
    const escrowAddress = document.getElementById('escrow-contract').value;
    console.log(EscrowContract.abi);
    const escrowContract = new ethers.Contract(escrowAddress, EscrowContract.abi, signer);
    const balance = await provider.getBalance(escrowAddress);
    console.log('balance:', balance);
    const formattedBalance = ethers.utils.formatEther(balance);
    console.log('formattedBalance', formattedBalance);
    const arbiter = await escrowContract.arbiter();
    const beneficiary = await escrowContract.beneficiary();
    console.log('arbiter, beneficiary', arbiter, beneficiary);

    const escrow = {
      address: escrowContract.address,
      arbiter: arbiter,
      beneficiary: beneficiary,
      value: formattedBalance,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };
    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        
        <label>
          Connected Wallet
          <input type="text" id="connectedWallet" value={account} disabled="disabled"/>
        </label>
        
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" id="ethValue" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
      
      <div className="existing-contracts">
        <h1>Load Interface to already deployed contract</h1>
        <label>
          Contract Address
          <input type="text" id="escrow-contract" />
        </label>
        <div
          className="button"
          id="loadEscrow"
          onClick={(e) => {
            e.preventDefault();

            loadEscrow();
          }}
        >
          Load Contract Instance
        </div>
      </div>
      

      

    </>
  );

}

export default App;