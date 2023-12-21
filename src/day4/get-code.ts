// @ts-nocheck

import { runMain } from "../common";

/*
As far as the Elf has been able to figure out, you have to figure out which of the numbers you have appear 
in the list of winning numbers. 

The first match makes the card worth one point and each match after the first doubles the point value of that card.

Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53 --> 4 wins
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11

In the above example, card 1 has five winning numbers (41, 48, 83, 86, and 17) and eight numbers you have 
(83, 86, 6, 31, 17, 9, 48, and 53). Of the numbers you have, four of them (48, 83, 17, and 86) are winning numbers! 
That means card 1 is worth 8 points (1 for the first match, then doubled three times for each of the three matches after the first).
*/

function findCardWinTotal(card: string): number {
    console.log(card);
    let total = 0;
    const split1 = card.split("|");
    const winningNumbersStr = (split1[0].split(":"))[1].split(" ");
    const myNumbers = split1[1].split(" ");
    let winningNumbers = winningNumbersStr.map((num) => !isNaN(parseInt(num)) ? parseInt(num) : -1);
    winningNumbers = winningNumbers.filter((num) => num !== -1);
    console.log(winningNumbers);

    for (const numStr of myNumbers) {
        const num = parseInt(numStr);
        if (!isNaN(num) && winningNumbers.includes(num)) {
            total = total === 0 ? 1 : total * 2;
        }
    }
    return total;
}

function findCardWinTotalCards(card: string, cardTotals: Object, gameIndex: number): void {
    console.log(card);
    let total = 0;
    const split1 = card.split("|");
    const winningNumbersStr = (split1[0].split(":"))[1].split(" ");
    const myNumbers = split1[1].split(" ");
    let winningNumbers = winningNumbersStr.map((num) => !isNaN(parseInt(num)) ? parseInt(num) : -1);
    winningNumbers = winningNumbers.filter((num) => num !== -1);
    console.log(cardTotals[gameIndex]);

    for (const numStr of myNumbers) {
        const num = parseInt(numStr);
        if (!isNaN(num) && winningNumbers.includes(num)) {
            total += 1;
        }
    }

    // for each "win" from this card, add a duplicate card for each subsequent one
    for (let i=1; i<=total; i++) {
        if (!!cardTotals[gameIndex+i]) {
            cardTotals[gameIndex+i] = cardTotals[gameIndex+i] + cardTotals[gameIndex];
        }
    }
}

function findAllCardsTotal(cards: string[]): number {
    let total = 0;
    let cardTotals = {};
    for (let i=0; i<cards.length; i++) {
        cardTotals[i] = 1;
    }

    for (let i=0; i<cards.length; i++) {
        const card = cards[i];
        findCardWinTotalCards(card, cardTotals, i);
    }

    for (let i=0; i<cards.length; i++) {
        total += cardTotals[i];
    }
    return total;
}

// MAIN
const fs = require("fs");

const testFileLoc = process.cwd() + "/src/day4/test-input.txt";
const puzzleFileLoc = process.cwd() + "/src/day4/puzzle-input.txt";

const fileToRun = puzzleFileLoc;

console.log(`Looking for file ${fileToRun}`);
const puzzleFile = fs.readFileSync(fileToRun).toString();
const allCards = puzzleFile.split("\n");

const total = findAllCardsTotal(allCards);
console.log(total);
