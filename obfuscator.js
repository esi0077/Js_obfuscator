// ░█████╗░██████╗░███╗░░░███╗██╗███╗░░██╗  ███████╗░██████╗███╗░░░███╗░█████╗░██╗██╗░░░░░██╗
// ██╔══██╗██╔══██╗████╗░████║██║████╗░██║  ██╔════╝██╔════╝████╗░████║██╔══██╗██║██║░░░░░██║
// ███████║██████╔╝██╔████╔██║██║██╔██╗██║  █████╗░░╚█████╗░██╔████╔██║███████║██║██║░░░░░██║
// ██╔══██║██╔══██╗██║╚██╔╝██║██║██║╚████║  ██╔══╝░░░╚═══██╗██║╚██╔╝██║██╔══██║██║██║░░░░░██║
// ██║░░██║██║░░██║██║░╚═╝░██║██║██║░╚███║  ███████╗██████╔╝██║░╚═╝░██║██║░░██║██║███████╗██║
// ╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝╚═╝╚═╝░░╚══╝  ╚══════╝╚═════╝░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚══════╝╚═╝
// you can find my other script on my github 
// github : https://github.com/esi0077


const fs = require('fs');
const path = require('path');

// Custom encoding and decoding functions
function customEncode(str) {
    let nextCharCode = 1000;
    const encodingMap = {};

    // Create encoding map
    for (let charCode = 32; charCode < 127; charCode++) {
        const char = String.fromCharCode(charCode);
        const encodedChar = 'armin' + nextCharCode++;
        encodingMap[char] = encodedChar;
    }

    // Encode the string
    return str.split('').map(char => encodingMap[char] || char).join('');
}

function extraEncode(str) {
    let nextCharCode = 2000;
    const encodingMap = {};

    // Create encoding map for the second layer
    for (let charCode = 32; charCode < 127; charCode++) {
        const char = String.fromCharCode(charCode);
        const encodedChar = 'extra' + nextCharCode++;
        encodingMap[char] = encodedChar;
    }

    // Encode the string
    return str.split('').map(char => encodingMap[char] || char).join('');
}

// Function to split the input code into fragments
function splitCode(inputCode, fragmentSize = 50) {
    const fragments = [];
    for (let i = 0; i < inputCode.length; i += fragmentSize) {
        fragments.push(inputCode.slice(i, i + fragmentSize));
    }
    return fragments;
}

// Function to generate random dummy code with more 'armin' references
function generateDummyCode(length = 400) {
    let dummyCode = '';
    const chars = 'arminabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        dummyCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Generating a random function name with 'armin' reference
    const functionName = `ArminObfuscateFunction${Math.random(200,500).toString().slice(2)}`;
    return `
    function ${functionName}() {return '${dummyCode}';}${functionName}();`;
}

// Generate a function with random code and insert real code fragments
function generateArminFunction(fragments) {
    let arminCode = 'function arminFunction() {';
    const dummyCodeLength = 1200;
    let fragmentIndex = 0;

    for (let i = 0; i < dummyCodeLength; i++) {
        if (Math.random() < 0.1 && fragmentIndex < fragments.length) {
            const fragment = fragments[fragmentIndex++];
            const encodedFragment = extraEncode(customEncode(fragment));
            arminCode += `var codeFragment${i} = '${encodedFragment}'; `;
        } else {
            arminCode += generateDummyCode();
        }
    }

    arminCode += 'function dummyFunction() { for(let i=0;i<10;i++) { Math.random(); } } }';
    return arminCode;
}

// Create a self-decoding wrapper with added complexity
function createSelfDecodingWrapper(encodedCode) {
    // Escape single quotes and other special characters for safety in a JavaScript string literal
    const encodedCodeSafe = encodedCode
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');

    // Complex decoding logic with multiple nested functions
    return `(function(){${generateArminFunction(splitCode(encodedCodeSafe))}function customDecode(encodedStr){let nextCharCode=1000;const decodingMap={};for(let charCode=32;charCode<127;charCode++){const char=String.fromCharCode(charCode);const encodedChar='armin'+nextCharCode++;decodingMap[encodedChar]=char;}return encodedStr.split(/(armin\\d+)/g).map(segment=>decodingMap[segment]||segment).join('');}function extraDecode(encodedStr){let nextCharCode=2000;const decodingMap={};for(let charCode=32;charCode<127;charCode++){const char=String.fromCharCode(charCode);const encodedChar='extra'+nextCharCode++;decodingMap[encodedChar]=char;}return encodedStr.split(/(extra\\d+)/g).map(segment=>decodingMap[segment]||segment).join('');}function decodeArmin(){const encoded='${encodedCodeSafe}';return customDecode(extraDecode(encoded));}eval(decodeArmin());})();`;
}

// Function to obfuscate JavaScript code
function obfuscateCode(inputCode) {
    // Split and obfuscate the code
    const fragments = splitCode(inputCode);
    let obfuscatedCode = fragments.map(fragment => customEncode(fragment)).join('');

    // Apply the additional layer of encoding
    const doubleObfuscatedCode = extraEncode(obfuscatedCode);

    // Wrap the double encoded code with a self-decoding function
    return createSelfDecodingWrapper(doubleObfuscatedCode);
}

// Main function to read, obfuscate, and write the code
function obfuscateFile(inputFilePath, outputFilePath) {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }

        const obfuscatedCode = obfuscateCode(data);

        const comment = `// ░█████╗░██████╗░███╗░░░███╗██╗███╗░░██╗  ███████╗░██████╗███╗░░░███╗░█████╗░██╗██╗░░░░░██╗
// ██╔══██╗██╔══██╗████╗░████║██║████╗░██║  ██╔════╝██╔════╝████╗░████║██╔══██╗██║██║░░░░░██║
// ███████║██████╔╝██╔████╔██║██║██╔██╗██║  █████╗░░╚█████╗░██╔████╔██║███████║██║██║░░░░░██║
// ██╔══██║██╔══██╗██║╚██╔╝██║██║██║╚████║  ██╔══╝░░░╚═══██╗██║╚██╔╝██║██╔══██║██║██║░░░░░██║
// ██║░░██║██║░░██║██║░╚═╝░██║██║██║░╚███║  ███████╗██████╔╝██║░╚═╝░██║██║░░██║██║███████╗██║
// ╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝╚═╝╚═╝░░╚══╝  ╚══════╝╚═════╝░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚══════╝╚═╝
// you can find my other script on my github 
// github : https://github.com/esi0077`;

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


// Create a self-decoding wrapper with added complexity
function createSelfDecodingWrapper(encodedCode) {
    // Escape single quotes and other special characters for safety in a JavaScript string literal
    const encodedCodeSafe = encodedCode
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');

    // Complex decoding logic with multiple nested functions
    return `(function(){${generateArminFunction(splitCode(encodedCodeSafe))}function customDecode(encodedStr){let nextCharCode=1000;const decodingMap={};for(let charCode=32;charCode<127;charCode++){const char=String.fromCharCode(charCode);const encodedChar='armin'+nextCharCode++;decodingMap[encodedChar]=char;}return encodedStr.split(/(armin\\d+)/g).map(segment=>decodingMap[segment]||segment).join('');}function extraDecode(encodedStr){let nextCharCode=2000;const decodingMap={};for(let charCode=32;charCode<127;charCode++){const char=String.fromCharCode(charCode);const encodedChar='extra'+nextCharCode++;decodingMap[encodedChar]=char;}return encodedStr.split(/(extra\\d+)/g).map(segment=>decodingMap[segment]||segment).join('');}function decodeArmin(){const encoded='${encodedCodeSafe}';return customDecode(extraDecode(encoded));}eval(decodeArmin());})();`;
}