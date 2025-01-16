"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const constant_1 = require("./constant");
function main({ outputFolderName }) {
    const root = process.cwd();
    const gitRecoverIndexRecoverPath = path_1.default.join(root, outputFolderName);
    // Get list of all lost commits
    const unreachableCommits = (0, child_process_1.execSync)(`git fsck --cache --no-reflogs --lost-found --dangling HEAD`)
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
    if (fs_1.default.existsSync(gitRecoverIndexRecoverPath)) {
        console.error(`folder ${gitRecoverIndexRecoverPath} already exists`);
        return;
    }
    else {
        fs_1.default.mkdirSync(gitRecoverIndexRecoverPath, { recursive: true });
    }
    console.log(`${unreachableCommits.length} lost commit(s) found. Processing...`);
    recoverCommits(unreachableCommits, gitRecoverIndexRecoverPath);
    console.log("Done.");
    console.log(`Find recovered commits at ${gitRecoverIndexRecoverPath}`);
}
function recoverCommits(commits, recoverPath) {
    commits.reverse().forEach((commit, index) => {
        const gitShow = (0, child_process_1.spawn)("git", ["show", commit]);
        gitShow.stdout.on("data", (data) => {
            if (data && data.toString() && data.toString().length) {
                const filename = path_1.default.join(recoverPath, `file-${index + 1}`);
                const fileStream = fs_1.default.createWriteStream(filename);
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
inquirer_1.default
    .prompt([
    {
        type: "input",
        name: "outputFolderName",
        message: "Please enter the name of the output folder to be restored (default GID_RECORDED):",
        default: constant_1.Default_Recover_Path,
    },
])
    .then((answers) => {
    main(answers);
})
    .catch((error) => {
    console.error("Error:", error);
});
