import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ThreeDots } from "react-loader-spinner"
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x3991B261d533D55bce6911B1e5D95Ef050621379";

  // references the abi content!
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      /*
      * First make sure we have access to window.ethereum
      */
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {

    if (!message) {
      alert("Enter a message!");
      return;
    }
    
    try {
      const { ethereum } = window;

      if (ethereum) {
        setLoading(true);
        setDisableBtn(true);
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        /*
        * You're using contractABI here
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        try {
          const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
          console.log("Mining...", waveTxn.hash);
  
          await waveTxn.wait();
          console.log("Mined -- ", waveTxn.hash);
          alert("Message sent!");
          
          setMessage("");
        } catch (error) {
          alert("Wait 15 minutes before sending another message");
        }
        
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        setLoading(false);
        setDisableBtn(false);
        getAllWaves();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
   * Create a method that gets all waves from the contract
   */
  const getAllWaves = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();
        
        // We only need address, timestamp, and message in our UI
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        // Store our data in React State
        setAllWaves(wavesCleaned.reverse());
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        }, ...prevState
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);
  
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hi There!
        </div>

        <div className="bio">
          I am Anonymous Dragon and I am learning Blockchain for developing Web3 dApp. Connect your Ethereum wallet and wave at me!
        </div>
        
        <div className="totalWaves">
          <h2>Total Waves: {allWaves.length}</h2>
        </div>

        {loading ? (
            <ThreeDots id="loader" color="#2BAD60" height="100" width="100" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
          ) : (
            <input className={message ? "validMessage" : "messageBox"} name="message" onChange={e => setMessage(e.target.value)} value={message} placeholder="Send me a message and win 0.0001 ETH xD" />
          )}
        
        <button disabled={disableBtn} className="waveButton" onClick={wave}>
          Wave at Me
        </button>
    
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <h2 className="waveLogs">Wave Logs</h2>
        
        {allWaves.map((wave, index) => {
          return (
            <div className="waveLog" key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: <a href={"https://rinkeby.etherscan.io/address/" + wave.address}>{wave.address}</a></div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
    })}
        
      </div>
    </div>
  );
}

export default App