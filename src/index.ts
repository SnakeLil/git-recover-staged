import fs from "fs";
import { execSync, spawn } from "child_process";
import path from "path";
import inquirer from "inquirer";
import { Default_Recover_Path } from "./constant";
// git fsck --cache --no-reflogs --lost-found --dangling HEAD 执行，数组最后面的是最新的

interface Answers {
  outputFolderName: string;
}

function main({ outputFolderName }: Answers) {
  const root = process.cwd();
  const gitRecoverIndexRecoverPath = path.join(root, outputFolderName);

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

  if (unreachableCommits.length === 0) {
    console.log("No lost commit found. Hope it is the desired!");
    return;
  }
  // create restore folder
  if (fs.existsSync(gitRecoverIndexRecoverPath)) {
    console.error(`folder ${gitRecoverIndexRecoverPath} already exists`);
    return;
  } else {
    fs.mkdirSync(gitRecoverIndexRecoverPath, { recursive: true });
  }

  console.log(
    `${unreachableCommits.length} lost commit(s) found. Processing...`
  );

  recoverCommits(unreachableCommits, gitRecoverIndexRecoverPath);
  console.log("Done.");
  console.log(`Find recovered commits at ${gitRecoverIndexRecoverPath}`);
}

function recoverCommits(commits: string[], recoverPath: string) {
  commits.reverse().forEach((commit, index) => {
    const gitShow = spawn("git", ["show", commit]);
    gitShow.stdout.on("data", (data) => {
      if (data && data.toString() && data.toString().length) {
        const filename = path.join(recoverPath, `file-${index + 1}`);
        const fileStream = fs.createWriteStream(filename);
        const dataStrPrefix = data.toString().slice(0, 4);
        if (dataStrPrefix !== "tree") {
          fileStream.write(data);
          console.log("write data");
        }
      }
    });
    // gitShow.stdout.pipe(fileStream);
    gitShow.on("error", (err) => {
      console.error(`Failed to start git show process: ${err.message}`);
    });
    gitShow.on("close", (code) => {
      if (code !== 0) {
        console.error(`git show process exited with code ${code}`);
      }
    });
  });
}
inquirer
  .prompt([
    {
      type: "input",
      name: "outputFolderName",
      message:
        "Please enter the name of the output folder to be restored (default GID_RECORDED):",
      default: Default_Recover_Path,
    },
  ])
  .then((answers) => {
    main(answers);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
