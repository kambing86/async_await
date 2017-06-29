const fs = require("fs");
const oldReadFile = fs.readFile;
fs.readFile = function () {
  setTimeout(() => {
    oldReadFile.apply(fs, arguments);
  }, 1000);
};
const path = require("path");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

const folderPath = "./data";
const filePath = path.join(folderPath, "test1.txt");
const encoding = "UTF8";

//callback
//potential bug
//flying "V", callback hell, pyramid of doom
function callback() {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      console.error("1 error " + err);
      return;
    }
    console.log("1 callback: " + data);
    fs.readFile(path.join(folderPath, data), encoding, (err, data) => {
      if (err) {
        console.error("1 error " + err);
        return;
      }
      console.log("1 callback: " + data);
      fs.readFile(path.join(folderPath, data), encoding, (err, data) => {
        if (err) {
          console.error("1 error " + err);
          return;
        }
        console.log("1 callback: " + data);
      });
    });
  });
}

//node promise
function promise() {
  readFilePromise(filePath, encoding)
    .then(data => {
      console.log("2 promise: " + data);
      return readFilePromise(path.join(folderPath, data), encoding);
    })
    .then(data => {
      console.log("2 promise: " + data);
      return readFilePromise(path.join(folderPath, data), encoding);
    })
    .then(data => {
      console.log("2 promise: " + data);
    })
    .catch(err => {
      console.error("2 error " + err);
    });
}

//async
const asyncFunc = async () => {
  try {
    const data = await readFilePromise(filePath, encoding);
    console.log("3 async: " + data);
    const data2 = await readFilePromise(path.join(folderPath, data), encoding);
    console.log("3 async: " + data2);
    const data3 = await readFilePromise(path.join(folderPath, data2), encoding);
    console.log("3 async: " + data3);
  } catch (err) {
    console.error("3 error " + err);
  }
};

callback();
promise();
asyncFunc();
