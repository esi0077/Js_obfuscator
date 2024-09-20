const fs = require('fs');
const crypto = require('crypto');

const numKeys = 10; // Number of keys to generate
const keysFilePath = 'keys.json';

// Function to generate a random key
function generateKey() {
  return crypto.randomBytes(16).toString('hex');
}

// Generate keys and save to file
const keys = [];
for (let i = 0; i < numKeys; i++) {
  keys.push(generateKey());
}

// Save keys to a file
fs.writeFileSync(keysFilePath, JSON.stringify(keys, null, 2));
console.log(`Generated ${numKeys} keys and saved to ${keysFilePath}`);
