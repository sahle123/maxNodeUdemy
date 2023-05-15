// All bandages, rubber bands, spit, glue, and wrappers for adding
// or making certain missing functionality in JavaScript work properly.

const fs = require('fs');

module.exports = class Basic {

    // Checks if an object is empty.
    // Fastest way taken from: https://stackoverflow.com/a/59787784/6369752
    static isEmpty(obj) {
        for (var i in obj)
            return false;
        return true;
    }

    // Writes so object to a JSON file.
    static writeToFile = (path, obj) => {
        fs.writeFile(path, JSON.stringify(obj), (err) => {
            if (err) logger.logError(err);
        });
    }

    // Extracts connect-flash error message or sets string to null.
    static getFlashErrorMsg(str) {
        if (str.length > 0) { 
            str = str[0]; 
        }
        else { 
            str = null; 
        }
        return str;
    }
}