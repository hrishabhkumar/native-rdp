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
          fs.copyFileSync(
            "./native/index.node",
            "./lib/release/release-" +
              supportedTarget[0] +
              "-" +
              supportedTarget[2] +
              ".node"
          );
        }
        runScripts(index + 1);
      }
    );
  } else {
    runScripts(index + 1);
  }
};

runScripts(0);
var namesMap = {};
var script = '';
var script2 = '';
supportedTargets.forEach((target) => {
    var name = (
        "release-" +
        target[0] +
        "-" +
        target[2] +
        ".node"
      );
      var requireName = (
        "release_" +
        target[0] +
        "_" +
        target[2]
      );
      namesMap[name] = requireName;
      script += 'var '+requireName+" = require(\"./"+name+"\");\n"

      script2 += "module.exports."+name+" = "+requireName+";\n";
});

script += script2;

fs.writeFileSync("./lib/release/index.js", script);

// var script = `
//     var relese_electron_69 = require('./relese-electron-69.node')
//     module.exports = {
//         'relese-electron-69.node': relese_electron_69
//     }`;
