const crypto = require('crypto');

function generateKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
}

function signHash(dataHash, privateKey) {
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(dataHash);
  signer.end();
  return signer.sign(privateKey, 'hex');
}

function verifySignature(dataHash, signature, publicKey) {
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(dataHash);
  verifier.end();
  return verifier.verify(publicKey, signature, 'hex');
}

module.exports = {
  generateKeyPair,
  signHash,
  verifySignature,
};
