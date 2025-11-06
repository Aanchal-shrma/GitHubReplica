const fs = require("fs").promises;
const path = require("path");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".githubFiles");
  const commitsPath = path.join(repoPath, "commits");
  const remotePath = path.resolve(process.cwd(), ".remoteRepo"); // local remote

  try {
    // make sure remoteRepo exists
    await fs.mkdir(remotePath, { recursive: true });

    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const localCommitPath = path.join(commitsPath, commitDir);
      const remoteCommitPath = path.join(remotePath, commitDir);

      await fs.mkdir(remoteCommitPath, { recursive: true });

      const files = await fs.readdir(localCommitPath);
      for (const file of files) {
        await fs.copyFile(
          path.join(localCommitPath, file),
          path.join(remoteCommitPath, file)
        );
      }

      console.log(`Pushed commit ${commitDir} to local remote repo`);
    }
  } catch (error) {
    console.error("Error while pushing:", error);
  }
}

module.exports = { pushRepo };
