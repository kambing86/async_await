const inquirer = require("inquirer");
const allModules = [
  {
    name: "./01_basic",
    value: require("./01_basic")
  },
  {
    name: "./02_sequece",
    value: require("./02_sequece")
  },
  {
    name: "./03_parallel",
    value: require("./03_parallel")
  },
  {
    name: "./04_parallel_track",
    value: require("./04_parallel_track")
  }
];
inquirer.prompt([{
  name: "run",
  type: "list",
  message: "which file to run?",
  choices: allModules
}]).then(answers => {
  answers.run();
}).catch(err => {
  console.error(err);
});
