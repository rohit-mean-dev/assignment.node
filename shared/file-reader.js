const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const fileReader = async (path, newValues) => {
    try {
        let data = await readFile(path);
        data = data.toString();
        for (var key in newValues) {
            const replaceExpression = new RegExp(`${key}`, "g");
            data = data.replace(replaceExpression, newValues[key]);
        }
        return data.toString();
    } catch (error) {
        throw error
    }
}

module.exports = {
    fileReader
}