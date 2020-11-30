// const child_process = require('child_process');
// const supportedTargets = require('./package.json').supportedTargets;

module.exports = function(supportedTarget) {
    build(["npm", "run", "build:artifacts"], {
        electron: supportedTarget
    }, function(err) {
        if (err) {
          console.log('Installation failed.');
        } else {
          console.log('Installation succeeded!'); 
        }       
      });
}
