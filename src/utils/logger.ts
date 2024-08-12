import fs from "fs";
import path from "path";

export const logError = (err: Error) => {
  const logDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = path.join(logDir, "error.log");
  const logMessage = `${new Date().toISOString()} - ${err.stack}\n`;

  fs.appendFile(logFile, logMessage, (appendErr) => {
    if (appendErr) console.error("Failed to write to log file:", appendErr);
  });
};
