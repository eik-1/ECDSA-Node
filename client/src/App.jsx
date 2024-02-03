import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Header from "./Header";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");

  return (
    <div className="app">
      <Header />
      <Wallet
        balance={balance}
        setBalance={setBalance}
        signature={signature}
        setSignature={setSignature}
        publicKey={publicKey}
        setPublicKey={setPublicKey}
      />
      <Transfer
        setBalance={setBalance}
        signature={signature}
        publicKey={publicKey}
      />
    </div>
  );
}

export default App;
