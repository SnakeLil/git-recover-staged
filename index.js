const fs = require("fs");
const { execSync, spawn } = require("child_process");
const path = require("path");

function main() {
  const root = process.cwd();
  const gitRecoverIndexRecoverPath = path.join(root, "GIT_RECOVERED");

  // Get list of all lost commits
  const unreachableCommits = execSync(
    `git fsck --cache --no-reflogs --lost-found --dangling HEAD`
  )
    .toString()
    .split("\n")
    .map((line) => {
      const id = line.trim().split(" ")[2];
      console.log(id, "id");
      return id;
    })
    .filter(Boolean);

//   if (unreachableCommits.length === 0) {
//     console.log("No lost commit found. Hope it is the desired!");
//     return;
//   }

//   fs.mkdirSync(gitRecoverIndexRecoverPath, { recursive: true });
//   console.log(
//     `${unreachableCommits.length} lost commit(s) found. Processing...`
//   );

//   recoverCommits(unreachableCommits, gitRecoverIndexRecoverPath);
//   console.log("Done.");
//   console.log(`Find recovered commits at ${gitRecoverIndexRecoverPath}`);
}

// function recoverCommits(commits, recoverPath) {
//     let i = 1;
//     commits.forEach(commit => {
//         const filename = path.join(recoverPath, `file-${i}`);
//         const fileStream = fs.createWriteStream(filename);

//         const gitShow = spawn('git', ['show', commit]);

//         gitShow.stdout.pipe(fileStream);

//         gitShow.on('error', (err) => {
//             console.error(`Failed to start git show process: ${err.message}`);
//         });

//         gitShow.on('close', (code) => {
//             if (code !== 0) {
//                 console.error(`git show process exited with code ${code}`);
//             }
//         });

//         fileStream.on('finish', () => {
//             console.log(`Commit ${commit} written to ${filename}`);
//         });

//         i++;
//     });
// }

main();
