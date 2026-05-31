// QQ Music cgiEncrypt/cgiDecrypt - extracted from vendor.chunk.js 2nd JSVMP
// Provides __cgiDecrypt for response decryption (same-length transform, synchronous)
// and __cgiEncrypt for request encryption (uses SubtleCrypto - async)

const fs = require("fs");
const path = require("path");

var oe = {
  Object: Object,
  Array: Array,
  String: String,
  Number: Number,
  Boolean: Boolean,
  RegExp: RegExp,
  Math: Math,
  Date: Date,
  JSON: JSON,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
  encodeURIComponent: encodeURIComponent,
  decodeURIComponent: decodeURIComponent,
  unescape: unescape,
  escape: escape,
  undefined: undefined,
  NaN: NaN,
  Infinity: Infinity,
  Function: Function,
  Error: Error,
  TypeError: TypeError,
  Uint8Array: Uint8Array,
  ArrayBuffer: ArrayBuffer,
  Int8Array: Int8Array,
  DataView: DataView,
  TextEncoder: (typeof TextEncoder !== "undefined") ? TextEncoder : require("util").TextEncoder,
  TextDecoder: (typeof TextDecoder !== "undefined") ? TextDecoder : require("util").TextDecoder,
  crypto: {
    subtle: {
      importKey: async function(format, keyData, algorithm, extractable, keyUsages) {
        return { type: "secret", algorithm, keyData, extractable, usages: keyUsages };
      },
      encrypt: async function(algorithm, key, data) {
        const crypto = require("crypto");
        const iv = Buffer.from(algorithm.iv);
        const cipher = crypto.createCipheriv("aes-128-gcm", Buffer.from(key.keyData), iv);
        const enc = cipher.update(Buffer.from(data));
        cipher.final();
        const tag = cipher.getAuthTag();
        const result = Buffer.concat([enc, cipher.final ? Buffer.alloc(0) : Buffer.alloc(0), tag]);
        return Buffer.concat([enc, tag]).buffer;
      },
      decrypt: async function(algorithm, key, data) {
        const crypto = require("crypto");
        const iv = Buffer.from(algorithm.iv);
        const buf = Buffer.from(data);
        const tag = buf.slice(-16);
        const ct = buf.slice(0, -16);
        const decipher = crypto.createDecipheriv("aes-128-gcm", Buffer.from(key.keyData), iv);
        decipher.setAuthTag(tag);
        const dec = decipher.update(ct);
        decipher.final();
        return Buffer.concat([dec]).buffer;
      }
    },
    getRandomValues: function(arr) {
      const crypto = require("crypto");
      const bytes = crypto.randomBytes(arr.length);
      for (let i = 0; i < arr.length; i++) arr[i] = bytes[i];
      return arr;
    }
  },
  window: null,
  navigator: {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
  },
  location: {
    host: "y.qq.com",
    hostname: "y.qq.com",
    href: "https://y.qq.com/",
    protocol: "https:",
    pathname: "/n/ryqq_v2/songDetail/0004BoFH1kpYFC"
  },
  document: { cookie: "" },
  self: null,
  Promise: Promise,
  setTimeout: setTimeout,
  console: console,
  btoa: function(s) { return Buffer.from(s, "binary").toString("base64"); },
  atob: function(s) { return Buffer.from(s, "base64").toString("binary"); },
};
oe.self = oe;
oe.window = oe;
oe.globalThis = oe;

// Load and execute the 2nd JSVMP bytecode interpreter
const jsvmp2Code = fs.readFileSync(path.join(__dirname, "jsvmp2_raw.js"), "utf-8");

// The JSVMP code is an IIFE that references `oe` as a free variable.
// We wrap it in a function that provides `oe`.
const wrappedCode = `(function(oe) { ${jsvmp2Code}; return oe; })`;
const fn = eval(wrappedCode);
const result = fn(oe);

var cgiEncrypt = oe.__cgiEncrypt;
var cgiDecrypt = oe.__cgiDecrypt;

if (!cgiDecrypt) {
  console.error("Failed to extract __cgiDecrypt from JSVMP");
  process.exit(1);
}

if (!cgiEncrypt) {
  console.error("Warning: __cgiEncrypt not extracted (may need SubtleCrypto)");
}

// CLI interface
const args = process.argv.slice(2);
if (args[0] === "--decrypt" && args[1]) {
  // Input: hex-encoded binary response
  const hexInput = args[1];
  const buf = Buffer.from(hexInput, "hex");
  // Convert to ArrayBuffer (what XHR.response would be)
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  try {
    const decrypted = cgiDecrypt(ab);
    if (typeof decrypted === "string") {
      process.stdout.write(decrypted);
    } else if (decrypted instanceof ArrayBuffer || Buffer.isBuffer(decrypted)) {
      process.stdout.write(Buffer.from(decrypted).toString("utf-8"));
    } else {
      process.stdout.write(String(decrypted));
    }
  } catch (e) {
    console.error("Decrypt error:", e.message);
    process.exit(1);
  }
} else if (args[0] === "--encrypt" && args[1]) {
  // Input: plaintext JSON string
  const plaintext = args[1];
  (async () => {
    try {
      const encrypted = await cgiEncrypt(plaintext);
      if (typeof encrypted === "string") {
        process.stdout.write(encrypted);
      } else if (encrypted instanceof ArrayBuffer || Buffer.isBuffer(encrypted)) {
        process.stdout.write(Buffer.from(encrypted).toString("base64"));
      } else {
        process.stdout.write(String(encrypted));
      }
    } catch (e) {
      console.error("Encrypt error:", e.message);
      process.exit(1);
    }
  })();
} else if (args[0] === "--test") {
  console.log("cgiDecrypt type:", typeof cgiDecrypt);
  console.log("cgiEncrypt type:", typeof cgiEncrypt);
  console.log("JSVMP crypto module loaded successfully");
} else {
  console.log("Usage:");
  console.log("  node crypto.js --decrypt <hex>    Decrypt response (hex-encoded bytes)");
  console.log("  node crypto.js --encrypt <json>   Encrypt request (JSON string)");
  console.log("  node crypto.js --test             Test module loading");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { cgiEncrypt, cgiDecrypt };
}
