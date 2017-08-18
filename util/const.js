var fs = require('fs');

function readConstFromFile(fn) {
    var content = fs.readFileSync('./const/' + fn + '.json');

    return JSON.parse(content);
}

module.exports = readConstFromFile;