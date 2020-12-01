const build = require("electron-build-env");
const supportedTargets = require("./package.json").supportedTargets;
const fs = require("fs");

const runScripts = (index) => {
  if (supportedTargets.length <= index) {
    return;
  }
  var supportedTarget = supportedTargets[index];
  if (supportedTarget[0] === "electron") {
    build(
      ["npm", "run", "build:artifacts"],
      {
        electron: supportedTarget[1],
      },
      function (err) {
        if (err) {
          console.log("Installation failed.");
        } else {
          console.log("Installation succeeded!");
          build(
            ["npm", "run", "package"],
            {
              electron: supportedTarget[1],
            },
            function (err) {
              if (err) {
                console.log("Installation failed.");
              } else {
                console.log("Installation succeeded!");
                
              }
              runScripts(index + 1);
            }
          );
        }
      }
    );
  } else {
    runScripts(index + 1);
  }
};

runScripts(0);

// var script = `
//     var relese_electron_69 = require('./relese-electron-69.node')
//     module.exports = {
//         'relese-electron-69.node': relese_electron_69
//     }`;
