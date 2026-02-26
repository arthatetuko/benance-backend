import pkg from "elliptic";

const { ec: EC } = pkg;
const ec = new EC("secp256k1");

const privateKey = "dfb7098d394110f986a503ca5336601a9df15581f7bbc6ad843db9380f434c02";

const key = ec.keyFromPrivate(privateKey, "hex");

console.log("Compressed HEX:");
console.log(key.getPublic(true, "hex"));

console.log("Compressed BASE64:");
console.log(
  Buffer.from(key.getPublic(true, "hex"), "hex").toString("base64")
);