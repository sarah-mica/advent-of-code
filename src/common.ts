// @ts-nocheck

// MAIN
export function runMain(testFileLoc, puzzleFileLoc) {
    const fs = require("fs");
    
    const fileToRun = process.cwd() + puzzleFileLoc;
    
    console.log(`Looking for file ${fileToRun}`);
    const puzzleFile = fs.readFileSync(fileToRun).toString();
    const allCards = puzzleFile.split("\n");
    
    const total = findAllCardsTotal(allCards);
    console.log(total);
}
