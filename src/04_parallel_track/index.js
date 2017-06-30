module.exports = () => {
  const fs = require("fs");
  const oldReadFile = fs.readFile;
  fs.readFile = function () {
    setTimeout(() => {
      oldReadFile.apply(fs, arguments);
    }, 1000);
  };
  const Promise = require("bluebird");
  const path = require("path");
  const readFilePromise = Promise.promisify(fs.readFile);

  const folderPath = "./data";
  const filePath = path.join(folderPath, "test1.txt");
  const filePath2 = path.join(folderPath, "test2.txt");
  const filePath3 = path.join(folderPath, "test3.txt");
  const filePath4 = path.join(folderPath, "test4.txt");
  const encoding = "UTF8";

  //bluebird promise
  function promise() {
    const ary = [];
    ary.push(readFilePromise(filePath, encoding));
    ary.push(readFilePromise(filePath2, encoding));
    ary.push(readFilePromise(filePath3, encoding));
    ary.push(readFilePromise(filePath4, encoding));
    Promise.all(ary)
      .then(results => {
        console.log("2 promise: " + results);
        checkStatus(ary);
      })
      .catch(err => {
        console.error("2 error " + err);
        checkStatus(ary);
        setTimeout(() => checkStatus(ary), 1000);
      });
  }

  //async
  const asyncFunc = async() => {
    const ary = [];
    try {
      ary.push(readFilePromise(filePath, encoding));
      ary.push(readFilePromise(filePath2, encoding));
      ary.push(readFilePromise(filePath3, encoding));
      ary.push(readFilePromise(filePath4, encoding));
      const results = await Promise.all(ary);
      console.log("3 async: " + results);
      checkStatus(ary);
    } catch (err) {
      console.error("3 error " + err);
      checkStatus(ary);
      setTimeout(() => checkStatus(ary), 1000);
    }
  };

  function checkStatus(ary) {
    for (const i in ary) {
      const p = ary[i];
      var status;
      if (p.isFulfilled()) {
        status = "success";
      } else if (p.isRejected()) {
        status = "failed";
      } else if (p.isCancelled()) {
        status = "cancelled";
      } else if (p.isPending()) {
        status = "pending";
      }
      console.log(`Promise ${parseInt(i) + 1} ${status}`);
    }
  }

  promise();
  asyncFunc();
};
