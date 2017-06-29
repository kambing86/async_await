// require("babel-polyfill");
var inquirer = require("inquirer");
inquirer.prompt([{
  name: "run",
  type: "list",
  message: "which file to run?",
  choices: [
    "./01_basic",
    "./02_sequece",
    "./03_parallel",
    "./04_parallel_track"
  ]
}]).then(answers => {
  require(answers.run);
}).catch(err => {
  console.error(err);
});
