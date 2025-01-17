async function buildPage() {
  const fs = require("fs");
  const path = require("path");
  const fsPromise = require("fs/promises");
  const destination = path.join(__dirname, "project-dist");

  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) throw err;
  })

  try {
    // create new html page with all components inside

    const components = await fsPromise.readdir(path.join(__dirname, "components"));
    await fs.readFile(path.join(__dirname, "template.html"), "utf-8", (err, data) => {
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

    // merge styles into one css file

    const styles = await fsPromise.readdir(path.join(__dirname, "styles"), { withFileTypes: true });
    const mergedStyles = path.join(__dirname, "project-dist/style.css");
    let data = "";
    for (let style of styles) {
      if (style.name.split(".")[1] !== "css") continue;
      const readableStream = fs.createReadStream(`${style.path}/${style.name}`, "utf-8");
      readableStream.on("data", (chunk) => data += chunk)
      readableStream.on("end", () => {
        fs.writeFile(mergedStyles, data, (err) => {
          if (err) throw err;
        })
      })
    }

    // copy assets

    async function copyDir() {
      fs.mkdir(path.join(__dirname, "project-dist/assets"),
        { recursive: true },
        (err) => { if (err) throw err; }
      )
      const folders = await fsPromise.readdir(`${__dirname}/assets`,
        { withFileTypes: true }
      )
      for (let folder of folders) {
        if (folder.name === ".DS_Store") continue;
        fs.mkdir(path.join(__dirname, `project-dist/assets/${folder.name}`),
          { recursive: true },
          (err) => { if (err) throw err; }
        )
        copyFiles(folder.path, folder.name);
      }
    }

    async function copyFiles(path, name) {
      const files = await fsPromise.readdir(`${path}/${name}`, { withFileTypes: true });
      const copiedFiles = await fsPromise.readdir(`${__dirname}/project-dist/assets/${name}`,
        { withFileTypes: true });
      if (copiedFiles) {
        for (let file of copiedFiles) {
          fs.unlink(`${__dirname}/project-dist/assets/${name}/${file.name}`,
            (err) => { if (err) throw err; }
          )
        }
      }

      for (let file of files) {
        fs.copyFile(`${file.path}/${file.name}`,
          `${__dirname}/project-dist/assets/${name}/${file.name}`,
          (err) => { if (err) throw err; }
        )
      }
    }
    copyDir();
  } catch (err) {
    console.log(err);
  }
}

buildPage()