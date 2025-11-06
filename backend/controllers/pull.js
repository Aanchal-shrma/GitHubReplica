const fs = require("fs").promises;
const path = require("path");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".githubFiles");
  const commitsPath = path.join(repoPath, "commits");
  const remotePath = path.resolve(process.cwd(), ".remoteRepo"); // local remote

  try {
    await fs.mkdir(commitsPath, { recursive: true });

    const remoteCommits = await fs.readdir(remotePath);

    for (const commitDir of remoteCommits) {
      const remoteCommitPath = path.join(remotePath, commitDir);
      const localCommitPath = path.join(commitsPath, commitDir);

      await fs.mkdir(localCommitPath, { recursive: true });

      const files = await fs.readdir(remoteCommitPath);
      for (const file of files) {
        await fs.copyFile(
          path.join(remoteCommitPath, file),
          path.join(localCommitPath, file)
        );
      }

      console.log(`Pulled commit ${commitDir} from local remote`);
    }
  } catch (error) {
    console.error("Error while pulling:", error);
  }
}

module.exports = { pullRepo };
