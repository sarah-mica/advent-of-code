// @ts-nocheck

function stepsToZZZ(instructions: string, map: string[]): number {
    let lookupMap = {};
    // first make a hashMap to lookup left/right locations from a loc
    for (const line of map) {
        // AAA = (BBB, CCC)
        const split = line.split("=");
        const loc = split[0].trim();
        const splitSecondPart = split[1].substring(2,10).split(",");
        const left = splitSecondPart[0].trim();
        const right = splitSecondPart[1].trim();

        lookupMap[loc] = [left, right];
    }

    //console.log(lookupMap);

    let currentLocation = "AAA";
    let numSteps = 0;
    while (currentLocation != "ZZZ") {
        for (const dir of instructions) {
            const options = lookupMap[currentLocation];
            //console.log(`curent location: ${currentLocation}, options: ${options}, direction to go: ${dir}`);
            if (dir === "R") {
                currentLocation = options[1];
            } else {
                currentLocation = options[0];
            }
            numSteps++;
        }
    }
    return numSteps;
}

// MAIN
const fs = require("fs");

const testFileLoc1 = process.cwd() + "/src/day8/test-input1.txt";
const testFileLoc2 = process.cwd() + "/src/day8/test-input2.txt";
const puzzleFileLoc = process.cwd() + "/src/day8/puzzle-input.txt";

const fileToRun = puzzleFileLoc;

console.log(`Looking for file ${fileToRun}`);
const puzzleFile = fs.readFileSync(fileToRun).toString();
const lines = puzzleFile.split("\n");

const result = stepsToZZZ(lines[0], lines.slice(2));
console.log(result);