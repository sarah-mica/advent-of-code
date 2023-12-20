// @ts-nocheck
const DIGITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function parseTwoDigits(jumbledCode: string): number {
    let firstDigit = -1;
    let lastDigit = -1;
    console.log(jumbledCode);

    for (const c of jumbledCode) {
        const num = parseInt(c);
        if(!isNaN(num)) {
            if (firstDigit === -1) {
                firstDigit = num;
                console.log("first digit: " + firstDigit);

            } 
            lastDigit = num;
        } else {
            console.log(c);
        }
    }
    console.log("last digit: " + lastDigit);
    const strNum = firstDigit.toString() + lastDigit.toString();
    console.log(parseInt(strNum));
    return parseInt(strNum);
}

function findCode(code: string): number {
    let wordStart = 0;
    let wordEnd = 1;
    // a = 1
    let firstDigit = -1; 
    let lastDigit = -1;
    // length = 14
    while (wordStart < code.length) {
        while(wordStart + wordEnd <= code.length && wordEnd < 6) {
            // wordStart = 7
            // wordEnd = 4;
            // twofourfive485
            //    .   .
            // increment end counter until you find a word or until you reach the max string length
            const subSection = code.substring(wordStart, wordStart + wordEnd);
            console.log("subSection: " + subSection);
            const digit = DIGITS.indexOf(subSection);
            if (digit !== -1) {
                if ( firstDigit === -1) firstDigit = digit;
                lastDigit = digit;
                console.log(lastDigit);
                break; // get out of this loop and increment wordStart
            }
            wordEnd++;
        }
        const num = parseInt(code.substring(wordStart, wordStart+1));
        console.log("Is num? " + num);
        if (!isNaN(num)) {
            if ( firstDigit === -1) firstDigit = num;
            lastDigit = num;
        }
        wordStart++;
        wordEnd = 1;
    }
    const strNum = firstDigit.toString() + lastDigit.toString();
    console.log(strNum);
    return parseInt(strNum);
}

function interpolateCode(codes: string[]): number {
    let total = 0;
    for (const code of codes) {
        total += parseTwoDigits(code);
    }
    return total;
}

function interpolateCodeWorded(codes: string[]): number {
    let total = 0;
    for (const code of codes) {
        total += findCode(code);
    }
    return total;
}

function test(): void {
    const testCodes = [
        "five8b",
        "2733vmmpknvgr", // --> 23"
        "3oneeighttwo", //   --> 33
        "twofourfive485", // --> 45
        "1abc2",      //    --> 12
        "pqr3stu8vwx",  //  --> 38
        "a1b2c3d4e5f",  //  --> 15
        "treb7uchet"  //   --> 77
    ];

    const total = interpolateCode(testCodes);
    console.log("TOTAL: " + total);
}

function test2(): void {
    const testCodes = [
        "two1nine", // 29
        "eightwothree", // 83
        "abcone2threexyz", // 13
        "xtwone3four",  // 24
        "4nineeightseven2", // 42
        "zoneight234", // 14
        "7pqrstsixteen" // 76
    ];

    const total = interpolateCodeWorded(testCodes);
    console.log("TOTAL: " + total);
}

// MAIN
let fs = require("fs");

const codesFileLoc = process.cwd() + "/src/day1/codes.txt";
console.log(`Looking for file ${codesFileLoc}`);
const codesFile = fs.readFileSync(codesFileLoc).toString();
const rawCodes = codesFile.split("\n");

const total = interpolateCodeWorded(rawCodes);
console.log(total);

//test2();

