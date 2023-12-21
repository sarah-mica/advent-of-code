// @ts-nocheck

/*
The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?
*/

function isValidNumber(schematic: string[], row: number, col: number, length: number): boolean {
    // search one to the left
    /*
    #####
    #111#
    #####
    */
    // ^^ search all of these # places around the number
    const startRow = Math.max(row-1, 0);
    const maxRow = Math.min(row+1, schematic.length-1);
    const startCol = Math.max(col-1, 0);
    const maxCol = Math.min(col+length+1,schematic[0].length);

    for (let rowIndex=startRow; rowIndex<=maxRow; rowIndex++) {
        console.log(rowIndex);
        const row = schematic[rowIndex];
        for (let col=startCol; col<maxCol; col++) {
            const c = row[col];
            console.log(`Checking isValid: ${c}`);

            // if it's not a number and not . it's a "symbol"
            if(isNaN(parseInt(c)) && c !== '.') {
                console.log(`Found symbol: ${c}`);
                return true;
            }
        }
    }
    return false;
}

function sumPartNumbers(schematic: string[]): number {
    let validNumbers: number[] = [];
    let currNumber = "";

    for (let rowIndex=0; rowIndex<schematic.length; rowIndex++) {
        const row = schematic[rowIndex];
        for (let colIndex=0; colIndex<schematic[0].length; colIndex++) {
            const c = row[colIndex];
            console.log(`c: ${c}`);
            const digit = parseInt(c);
            if (!isNaN(digit)) {
                currNumber += c;
            } else {
                // make sure the current number is valid
                if (currNumber.length > 0) {
                    console.log(`checking if ${currNumber} is valid`);
                    if (isValidNumber(schematic, rowIndex, colIndex-currNumber.length, currNumber.length)) {
                        validNumbers.push(parseInt(currNumber));
                    }
                    currNumber = "";
                }
            }
        }
        if (currNumber.length > 0) {
            console.log(`checking (end of row) if ${currNumber} is valid`);
            if (isValidNumber(schematic, rowIndex, schematic[0].length-currNumber.length, currNumber.length)) {
                validNumbers.push(parseInt(currNumber));
            }
            currNumber = "";
        }
    }
    const total = validNumbers.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
    );
    return total;
}



// MAIN
const fs = require("fs");

const testFilesLoc = process.cwd() + "/src/day3/test-input.txt";
const puzzleFileLoc = process.cwd() + "/src/day3/puzzle-input.txt";

console.log(`Looking for file ${puzzleFileLoc}`);
const puzzleFile = fs.readFileSync(puzzleFileLoc).toString();
const schematicLines = puzzleFile.split("\n");

const total = sumPartNumbers(schematicLines);
console.log(total);