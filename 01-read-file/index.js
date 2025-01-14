const fs = require("fs");
const path = require("path");
let data = "";
const readableStream = fs.createReadStream(path.join(__dirname, "text.txt"));
readableStream.on("data",(chunk) => (data += chunk.toString()));
readableStream.on("end", () => console.log(data));