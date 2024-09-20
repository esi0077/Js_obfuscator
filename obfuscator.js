const fs = require('fs');
const path = require('path');
const crypto = require('crypto');




// Example of the key provided by the user (for demo purposes)
const userProvidedKey = '072eb60505c8deb68fc0f39a3db62d87'; // Replace this with the actual key provided by the user



// Load the keys from the file
const keysFilePath = path.join(__dirname, 'keys.json');
const authorizedKeys = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));

// Function to check if a key is authorized
function isAuthorized(key) {
  return authorizedKeys.includes(key);
}



// Function to decode and check license
function checkLicense() {
  return isAuthorized(userProvidedKey);
}

// Example obfuscation functions
function customEncode(str) {
  let nextCharCode = 1000;
  const encodingMap = {};

  for (let charCode = 32; charCode < 127; charCode++) {
    const char = String.fromCharCode(charCode);
    const encodedChar = 'armin' + nextCharCode++;
    encodingMap[char] = encodedChar;
  }

  return str.split('').map(char => encodingMap[char] || char).join('');
}

function extraEncode(str) {
  let nextCharCode = 2000;
  const encodingMap = {};

  for (let charCode = 32; charCode < 127; charCode++) {
    const char = String.fromCharCode(charCode);
    const encodedChar = 'extra' + nextCharCode++;
    encodingMap[char] = encodedChar;
  }

  return str.split('').map(char => encodingMap[char] || char).join('');
}

function splitCode(inputCode, fragmentSize = 50) {
  const fragments = [];
  for (let i = 0; i < inputCode.length; i += fragmentSize) {
    fragments.push(inputCode.slice(i, i + fragmentSize));
  }
  return fragments;
}

function generateDummyCode(length = 400) {
  let dummyCode = '';
  const chars = 'arminabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++) {
    dummyCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const functionName = `ArminObfuscateFunction${Math.random(200,500).toString().slice(2)}`;
  return `
  function ${functionName}() {return '${dummyCode}';}${functionName}();`;
}

function generateArminFunction(fragments) {
  let arminCode = 'function arminFunction() {';
  const dummyCodeLength = 1200;
  let fragmentIndex = 0;

  for (let i = 0; i < dummyCodeLength; i++) {
    if (Math.random() < 0.1 && fragmentIndex < fragments.length) {
      const fragment = fragments[fragmentIndex++];
      const encodedFragment = extraEncode(customEncode(fragment));
      arminCode += `\n    var codeFragment${i} = '${encodedFragment}'; `;
    } else {
      arminCode += generateDummyCode();
    }
  }

  arminCode += 'function dummyFunction() { for(let i=0;i<10;i++) { Math.random(); } } }';
  return arminCode;
}

function createSelfDecodingWrapper(encodedCode) {
  const encodedCodeSafe = encodedCode
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');

  return `(function(){${generateArminFunction(splitCode(encodedCodeSafe))}function customDecode(encodedStr){let nextCharCode=1000;const decodingMap={};for(let charCode=32;charCode<127;charCode++){const char=String.fromCharCode(charCode);const encodedChar='armin'+nextCharCode++;decodingMap[encodedChar]=char;}return encodedStr.split(/(armin\\d+)/g).map(segment=>decodingMap[segment]||segment).join('');}function extraDecode(encodedStr){let nextCharCode=2000;const decodingMap={};for(let charCode=32;charCode<127;charCode++){const char=String.fromCharCode(charCode);const encodedChar='extra'+nextCharCode++;decodingMap[encodedChar]=char;}return encodedStr.split(/(extra\\d+)/g).map(segment=>decodingMap[segment]||segment).join('');}function decodeArmin(){const encoded='${encodedCodeSafe}';return customDecode(extraDecode(encoded));}if (${checkLicense()}) {eval(decodeArmin());} else {console.error('Invalid license key.');}})();`;
}

function obfuscateCode(inputCode) {
  const fragments = splitCode(inputCode);
  let obfuscatedCode = fragments.map(fragment => customEncode(fragment)).join('');
  const doubleObfuscatedCode = extraEncode(obfuscatedCode);
  return createSelfDecodingWrapper(doubleObfuscatedCode);
}

function obfuscateFile(inputFilePath, outputFilePath) {
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const obfuscatedCode = obfuscateCode(data);

    const comment = `// Your obfuscation watermark here`;

    const outputCode = `${comment}\n\n${obfuscatedCode}`;
    fs.writeFile(outputFilePath, outputCode, (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }

      console.log(`Obfuscated code written to ${outputFilePath}`);
    });
  });
}

const inputFilePath = path.join(__dirname, 'input.js');
const outputFilePath = path.join(__dirname, 'output.js');

obfuscateFile(inputFilePath, outputFilePath);
