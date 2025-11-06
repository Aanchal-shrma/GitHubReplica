const fs = require("fs");
const path = require("path");
const { promisify } = require("util");  //used to verify validity

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".githubFiles");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);
    const files = await readdir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (let file of files) {
      await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }

    console.log(`revert to the ${commitID} is successfull`);
  } catch (error) {
    console.log("unable to revert", error);
  }
}

module.exports = { revertRepo };
