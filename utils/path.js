const path = require('path');

// Gives the project's working directory; NOT the file's. 
// This will help make our code more DRY.
module.exports = path.dirname(require.main.filename);