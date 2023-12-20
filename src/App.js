import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { ethers } from "ethers";
import "./App.css";
import EtherWallet from "./artifacts/contracts/EtherWallet.sol/EtherWallet.json";

function App() {
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);

  //EtherWallet Smart contract handling
  const [scBalance, setScBalance] = useState(0);
  const [ethToUseForDeposit, setEthToUseForDeposit] = useState(0);

  useEffect(() => {
    // Get balance of the smart contract
    async function getEtherWalletBalance() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress,
          EtherWallet.abi,
          provider
        );
        let balance = await contract.balanceOf();
        balance = ethers.utils.formatEther(balance);
        console.log("SC balance : ", balance);
        setScBalance(balance);
      } catch (err) {
        console.log(
          "Error while connecting to Etherwallet smart contract: ",
          err
        );
      }
    }
    getEtherWalletBalance();
  }, []);
  // Connect to metamask wallet
  const connectToMetamask = async () => {
    console.log("Connecting to Metamask...");
    setShouldDisable(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const account = await signer.getAddress();
      let balance = await signer.getBalance();

      balance = ethers.utils.formatEther(balance);

      console.log("account:", account);
      console.log("balance:", balance);
      setAccount(account);
      setBalance(balance);
      setIsActive(true);
      setShouldDisable(false);
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  };
  //Disconnect from Metamask wallet
  const disconnectFromMetamask = async () => {
    console.log("Disconnecting wallet from App...");
    try {
      setAccount("");
      setBalance(0);
      setIsActive(false);
    } catch (error) {
      console.log("Error on disconnect: ", error);
    }
  };
  // Deposit ETH to Etherwallet smart contract
  const depositToEtherWalletContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(account);
      const contract = new ethers.Contract(
        contractAddress,
        EtherWallet.abi,
        signer
      );
      const transaction = await contract.deposit({
        value: ethers.utils.parseEther(ethToUseForDeposit),
      });
      await transaction.wait();
      let balance = await signer.getBalance();
      balance = ethers.utils.formatEther(balance);
      setBalance(balance);

      let scBalance = await signer.BalanceOf();
      scBalance = ethers.utils.formatEther(scBalance);
      setScBalance(scBalance);
    } catch (err) {
      console.log(
        "Error while depositing ETH to EtherWallet smart contract: ",
        err
      );
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        {!isActive ? (
          <>
            <Button
              variant="secondary"
              onClick={connectToMetamask}
              disabled={shouldDisable}
            >
              <img
                src="images/metamask.svg"
                alt="metamask"
                width={50}
                height={50}
              />{" "}
              Connect to metamask
            </Button>
          </>
        ) : (
          <>
            <Button variant="danger" onClick={disconnectFromMetamask}>
              Disconnect Metamask{" "}
              <img
                src="images/hand.svg"
                alt="disconnect"
                width={50}
                height={50}
              />
            </Button>
            <div className="mt-2 mb-2">Connected Account: {account}</div>
            <div className="mt-2 mb-2">Balance: {balance}</div>
            <Form>
              <Form.Group className="mb-3" controlId="numberInEth">
                <Form.Control
                  type="text"
                  placeholder="Enter the amount in ETH"
                  onChange={(e) => setEthToUseForDeposit(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={depositToEtherWalletContract}
                >
                  Deposit to EtherWallet Smart Contract
                </Button>
              </Form.Group>
            </Form>
          </>
        )}
        <div>EtherWallet Smart Contract Address: {contractAddress}</div>
        <div>EtherWallet Smart Contract Balance: {scBalance}</div>
      </header>
    </div>
  );
}

export default App;
