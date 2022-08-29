
// Logs error message to console
exports.logError = (errMessage) => {
  console.log("[-] ERROR:", String(errMessage));
};

// Informational logs
exports.log = (message) => {
  console.log("[i]:", String(message));
};

// Informational log, but with a '+' sign. Indicating a positive message.
exports.plog = (message) => {
  console.log("[+]:", String(message));
};