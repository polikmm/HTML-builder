async function mergeStyles() {
  const path = require("path");
  const fs = require("fs");
  const fsPromise = require('fs/promises');
  const styles = path.join(__dirname, "styles");
  const mergedStyles = path.join(__dirname, "project-dist", "bundle.css");
  let data = "";

  try {
    const files = await fsPromise.readdir(styles, { withFileTypes: true });

    for (let file of files) {
      if (file.name.split(".")[1] !== "css") continue;
      const readableStream = fs.createReadStream(`${file.path}/${file.name}`, "utf-8");
      readableStream.on("data", (chunk) => data += chunk)
      readableStream.on("end", () => {
        fs.writeFile(mergedStyles, data, (err) => {
          if (err) throw err;
        })
      })
    }


  } catch (err) {
    console.log(err);
  }
}
mergeStyles();