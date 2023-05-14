
// Logs error message to console
exports.logError = (errMessage) => {
  console.log(`\u001b[0;31m[-] ERROR: ${String(errMessage)}\u001b[0m`);
};

// Informational logs
exports.log = (message) => {
  console.log(`\u001b[0;0m[i]: ${String(message)}`);
};

// Informational log, but with a '+' sign. Indicating a positive message.
exports.plog = (message) => {
  console.log(`\u001b[0;32m[+]: ${String(message)}\u001b[0m`);
};