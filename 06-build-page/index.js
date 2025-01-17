async function buildPage() {
  const fs = require("fs");
  const path = require("path");
  const fsPromise = require("fs/promises");
  const destination = path.join(__dirname, "project-dist");

  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) throw err;
  })

  try {
    const components = await fsPromise.readdir(path.join(__dirname, "components"));
    const layout = await fs.readFile(path.join(__dirname, "template.html"), "utf-8", (err,data) => {
      if (err) throw err;

      for (let item of components) {
        const regexp = new RegExp(`{{${item.split(".")[0]}}}`);
        const readableStream = fs.createReadStream(`${__dirname}/components/${item}`, "utf-8");
        let content = "";
        readableStream.on("data", (chunk) => content += chunk);
        readableStream.on("end", () => {
          data = data.replace(regexp, content)
          fs.writeFile(`${destination}/index.html`,
            data,
            (err) => { if (err) throw err; })
        })
      }
    })
    
  } catch (err) {
    console.log(err);
  }
}

buildPage()