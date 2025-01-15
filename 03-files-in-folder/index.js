const path = require("path");
const fs = require("fs");
const pathToFolder = path.join(__dirname, "secret-folder");

fs.readdir(pathToFolder, {withFileTypes: true}, (err, data) => {
  if (err) throw err;
  for (let file of data) {
    let info = "";
    info = `${file.name.split(".")[0]} - ${path.extname(file.name)} - `;
    fs.stat(`${file.path}/${file.name}`, (err, stats) => {
      if (stats.isFile()) {
        const size = (stats.size / 1024).toFixed(2);
        console.log(info+`${size}kb`);
      }
    })
  }
})

