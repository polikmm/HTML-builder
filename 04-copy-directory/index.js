async function copyDir() {
  const fs = require("fs");
  const path = require("path");
  const filesDir = path.join(__dirname, "files");
  const copiedDir = path.join(__dirname, "files-copy");
  const fsPromise = require('fs/promises');


  fs.mkdir(copiedDir, { recursive: true }, (error) => {
    if (error) throw error;
  })

  try {
    const files = await fsPromise.readdir(filesDir, { withFileTypes: true });
    const copiedFiles = await fsPromise.readdir(copiedDir, { withFileTypes: true });
    if (copiedFiles) {
      for (let copy of copiedFiles) {
        fs.unlink(`${copiedDir}/${copy.name}`, (err) => {
          if (err) throw err;
        })
      }
    }

    for (let file of files) {
      fs.copyFile(`${filesDir}/${file.name}`, `${copiedDir}/${file.name}`, (err) => {
        if (err) throw err;
      })
    }
  } catch (err) {
    console.log(err);
  }

}
copyDir();