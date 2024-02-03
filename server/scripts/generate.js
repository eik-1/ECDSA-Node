const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);
function signMessage(msg = "Transact") {
  const bytes = utf8ToBytes(msg);
  const hash = keccak256(bytes);
  const signer = secp256k1.sign(hash, privateKey);
  return signer;
}
const signature = signMessage();

// Convert components to hexadecimal strings
const rHex = signature.r.toString(16);
const sHex = signature.s.toString(16);
const recoveryHex = signature.recovery.toString(16);

// Ensure the hexadecimal strings have the correct length
const fullRHex = rHex.padStart(64, "0");
const fullSHex = sHex.padStart(64, "0");
const fullRecoveryHex = recoveryHex.padStart(2, "0");

// Combine components into a single hex string
const hexSignature = `0x${fullRHex}${fullSHex}${fullRecoveryHex}`;

console.log("Private Key: ", toHex(privateKey));
console.log("Public Key: ", toHex(publicKey));
console.log("Signature: ", hexSignature);

/*// Remove the '0x' prefix if present
const cleanHexSignature = hexSignature.startsWith('0x') ? hexSignature.slice(2) : hexSignature;

// Extract the components
const rHex = cleanHexSignature.slice(0, 64);
const sHex = cleanHexSignature.slice(64, 128);
const recoveryHex = cleanHexSignature.slice(128, 130);

// Convert hex components to BigInt and integer
const r = BigInt('0x' + rHex);
const s = BigInt('0x' + sHex);
const recovery = parseInt(recoveryHex, 16);

// Create raw signature object
const rawSignature = {
  r: r,
  s: s,
  recovery: recovery,
}; */
