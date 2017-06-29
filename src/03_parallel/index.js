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
const filePath2 = path.join(folderPath, "test2.txt");
const filePath3 = path.join(folderPath, "test3.txt");
const encoding = "UTF8";

//callback, potential bug
function callback() {
  var completed = 0;
  const results = [];
  function checkComplete(err, data) {
    completed++;
    if (err) {
      console.error("1 error " + err);
      return;
    }
    results.push(data);
    if (completed === 3) {
      console.log("1 callback (result not in order): " + results);
    }
  }
  fs.readFile(filePath, encoding, checkComplete);
  fs.readFile(filePath2, encoding, checkComplete);
  fs.readFile(filePath3, encoding, checkComplete);
}

//node promise
function promise() {
  const ary = [];
  ary.push(readFilePromise(filePath, encoding));
  ary.push(readFilePromise(filePath2, encoding));
  ary.push(readFilePromise(filePath3, encoding));
  Promise.all(ary)
    .then(results => {
      console.log("2 promise: " + results);
    })
    .catch(err => {
      console.error("2 error " + err);
    });
}

//async
const asyncFunc = async () => {
  const ary = [];
  try {
    ary.push(readFilePromise(filePath, encoding));
    ary.push(readFilePromise(filePath2, encoding));
    ary.push(readFilePromise(filePath3, encoding));
    const results = await Promise.all(ary);
    console.log("3 async: " + results);
  } catch (err) {
    console.error("3 error " + err);
  }
};

callback();
promise();
asyncFunc();
