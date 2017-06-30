module.exports = () => {
  const fs = require("fs");

  const bluebird = require("bluebird");
  const bbReadFilePromise = bluebird.promisify(fs.readFile);

  const util = require("util");
  const readFilePromise = util.promisify(fs.readFile);

  const filePath = "./data/test1.txt";
  const encoding = "UTF8";

  //callback
  function callback() {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        console.error("1 error " + err);
        return;
      }
      console.log("1 callback: " + data);
    });
  }

  //bluebird promise
  function promise1() {
    bbReadFilePromise(filePath, encoding)
      .then(data => {
        console.log("2 bb promise: " + data);
      })
      .catch(err => {
        console.error("2 error " + err);
      });
  }

  //node8 promise
  function promise2() {
    readFilePromise(filePath, encoding)
      .then(data => {
        console.log("3 promise: " + data);
      })
      .catch(err => {
        console.error("3 error " + err);
      });
  }

  //async
  const asyncFunc = async() => {
    try {
      const data = await readFilePromise(filePath, encoding);
      console.log("4 async: " + data);
    } catch (err) {
      console.error("4 error " + err);
    }
  };

  callback();
  promise1();
  promise2();
  asyncFunc();
};
