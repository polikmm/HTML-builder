const path = require("path");
const fs = require("fs");
const { stdin, stdout } = process;
let text = "";


stdout.write("write your message\n");

fs.writeFile(path.join(__dirname, "text.txt"),
  text,
  (err) => {
    if (err) throw err;
  })

stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    console.log("goodbye\n");
    process.exit();
  }
  
  fs.writeFile(path.join(__dirname, "text.txt"),
    text += data.toString(),
    (err) => {
      if (err) throw err;
    });

  process.on("SIGINT", () => {
    console.log("\ngoodbye\n");
    process.exit();
  })
})


