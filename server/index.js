const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: Get signature from client side
  //then recover the public key from signature
  const { sender, recipient, amount, signature } = req.body;

  // Remove the '0x' prefix if present
  const cleanHexSignature = signature.startsWith("0x")
    ? signature.slice(2)
    : signature;

  // Extract the components
  const rHex = cleanHexSignature.slice(0, 64);
  const sHex = cleanHexSignature.slice(64, 128);
  const recoveryHex = cleanHexSignature.slice(128, 130);

  // Convert hex components to BigInt and integer
  const r = BigInt("0x" + rHex);
  const s = BigInt("0x" + sHex);
  const recovery = parseInt(recoveryHex, 16);

  // Create raw signature object
  const rawSignature = {
    r: r,
    s: s,
    recovery: recovery,
  };

  const bytes = utf8ToBytes("Transact");
  const hash = keccak256(bytes);

  const isSigned = secp256k1.verify(signature, hash, sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    if (!isSigned) {
      res.status(400).send({ message: "Wrong sender" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
