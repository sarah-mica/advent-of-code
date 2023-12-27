// @ts-nocheck
/*
In Camel Cards, you get a list of hands, and your goal is to order them based on the strength of each hand. A hand consists of five cards labeled one of A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2. The relative strength of each card follows this order, where A is the highest and 2 is the lowest.

Every hand is exactly one type. From strongest to weakest, they are:

Five of a kind, where all five cards have the same label: AAAAA
Four of a kind, where four cards have the same label and one card has a different label: AA8AA
Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
High card, where all cards' labels are distinct: 23456
Hands are primarily ordered based on type; for example, every full house is stronger than any three of a kind.

If two hands have the same type, a second ordering rule takes effect. Start by comparing the first card in each hand. If these cards are different, the hand with the stronger first card is considered stronger. If the first card in each hand have the same label, however, then move on to considering the second card in each hand. If they differ, the hand with the higher second card wins; otherwise, continue with the third card in each hand, then the fourth, then the fifth.

So, 33332 and 2AAAA are both four of a kind hands, but 33332 is stronger because its first card is stronger. Similarly, 77888 and 77788 are both a full house, but 77888 is stronger because its third card is stronger (and both hands have the same first and second card).

To play Camel Cards, you are given a list of hands and their corresponding bid (your puzzle input). For example:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
This example shows five hands; each hand is followed by its bid amount. Each hand wins an amount equal to its bid multiplied by its rank, where the weakest hand gets rank 1, the second-weakest hand gets rank 2, and so on up to the strongest hand. Because there are five hands in this example, the strongest hand will have rank 5 and its bid will be multiplied by 5.

So, the first step is to put the hands in order of strength:

32T3K is the only one pair and the other hands are all a stronger type, so it gets rank 1.
KK677 and KTJJT are both two pair. Their first cards both have the same label, but the second card of KK677 is stronger (K vs T), so KTJJT gets rank 2 and KK677 gets rank 3.
T55J5 and QQQJA are both three of a kind. QQQJA has a stronger first card, so it gets rank 5 and T55J5 gets rank 4.
Now, you can determine the total winnings of this set of hands by adding up the result of multiplying each hand's bid with its rank (765 * 1 + 220 * 2 + 28 * 3 + 684 * 4 + 483 * 5). So the total winnings in this example are 6440.

Find the rank of every hand in your set. What are the total winnings?
*/

const HAND_TYPE = Object.freeze({
    FIVE_OF_A_KIND: 6,
    FOUR_OF_A_KIND: 5,
    FULL_HOUSE: 4,
    THREE_OF_A_KIND: 3,
    TWO_PAIR: 2,
    ONE_PAIR: 1,
    HIGH_CARD: 0,
    UNKNOWN: -1,
});

const CARD_VALUE = Object.freeze({
    "A": 14, 
    "K": 13, 
    "Q": 12, 
    "J": 1, // for a jack, this should be 11
    "T": 10,
    "9": 9,
    "8": 8, 
    "7": 7, 
    "6": 6, 
    "5": 5, 
    "4": 4, 
    "3": 3,
    "2": 2,
});

function charCount(str: string, char: string): number { 
    const count = str.split(char).length - 1; 
    return count; 
}

function addToDict(handValueDict: Object, key: number, val: string): void {
    (handValueDict[key] || (handValueDict[key] = [])).push(val);
}

function getHandType(hand: string): number {
    let handType = HAND_TYPE.HIGH_CARD;
    let previousMatch = "";
    let possibleHands = [HAND_TYPE.HIGH_CARD];
    const numJokers = charCount(hand, "J");
    if (numJokers === 5) return HAND_TYPE.FIVE_OF_A_KIND;

    for (let j=0; j<hand.length; j++) {
        if (hand[j] === "J") continue;
        const numInstances = charCount(hand, hand[j]);

        switch (numInstances) {
            case 5: 
                return HAND_TYPE.FIVE_OF_A_KIND;
            case 4: 
                return numJokers === 1 ? HAND_TYPE.FIVE_OF_A_KIND : HAND_TYPE.FOUR_OF_A_KIND;
            case 3: 
                // if it's a full house we would have seen two pair already or we will still see it so don't return yet
                if (handType === HAND_TYPE.ONE_PAIR) {
                    handType = HAND_TYPE.FULL_HOUSE;
                    possibleHands.push(handType);
                }
                switch(numJokers) {
                    case 2:
                        handType = HAND_TYPE.FIVE_OF_A_KIND;
                        possibleHands.push(handType);
                        break;
                    case 1:
                        handType = HAND_TYPE.FOUR_OF_A_KIND;
                        possibleHands.push(handType);
                        break;
                    case 0:
                        handType = HAND_TYPE.THREE_OF_A_KIND;
                        possibleHands.push(handType);
                        break;
                }

                break;
            case 2: 
                if (handType === HAND_TYPE.THREE_OF_A_KIND && previousMatch !== hand[j]) {
                    handType = HAND_TYPE.FULL_HOUSE;
                    possibleHands.push(handType);
                } else if (handType === HAND_TYPE.ONE_PAIR && previousMatch !== hand[j]) {
                    handType = HAND_TYPE.TWO_PAIR;
                    possibleHands.push(handType);
                } 
                switch(numJokers) {
                    case 3:
                        handType = HAND_TYPE.FIVE_OF_A_KIND;
                        possibleHands.push(handType);
                        break;
                    case 2:
                        handType = HAND_TYPE.FOUR_OF_A_KIND;
                        possibleHands.push(handType);
                        break;
                    case 1: 
                        handType = HAND_TYPE.THREE_OF_A_KIND;
                        possibleHands.push(handType);
                        previousMatch = hand[j];
                        break;
                    case 0:
                        handType = HAND_TYPE.ONE_PAIR;
                        previousMatch = hand[j];
                        possibleHands.push(handType);
                        break;
                }
                break;
            default:
                switch(numJokers) {
                    case 4:
                        return HAND_TYPE.FIVE_OF_A_KIND;
                    case 3:
                        handType = HAND_TYPE.FOUR_OF_A_KIND;
                        possibleHands.push(handType);
                        break;
                    case 2:
                        handType = HAND_TYPE.THREE_OF_A_KIND;
                        possibleHands.push(handType);
                        break;
                    case 1:
                        handType = HAND_TYPE.ONE_PAIR;
                        possibleHands.push(handType);
                        break;
                }
        }
    }
    console.log(possibleHands);
    return Math.max(...possibleHands);
}

function getTotalWinningsAllHands(hands: string[]): number {
    let handValueDict = {};
    // first we need to sort the hands in order of strength
    for (let i=0; i<hands.length; i++) {
        const handAndBid = hands[i].split(" ");
        const hand = handAndBid[0];

        // first pass just determine what type of hand it is
        // five of a kind?
        const handType = getHandType(hand);
        addToDict(handValueDict, handType, hands[i]);
    }
    console.log(handValueDict);

    // Now, we need to sort through the "equal value hand types"
    for (const handType of Object.keys(handValueDict)) {
        const unsortedHands = handValueDict[handType];
        if (unsortedHands.length === 1) continue;
        
        const sortedHands = unsortedHands.sort(function(handStr1: string, handStr2: string) {
            for (let i=0; i<5; i++) {
                const hand1 = (handStr1.split(" "))[0];
                const hand2 = (handStr2.split(" "))[0];

                const card1 = CARD_VALUE[hand1[i]];
                const card2 = CARD_VALUE[hand2[i]];
                if (card1 !== card2) {
                    return card1 - card2;
                }      
            }
        });
        handValueDict[handType] = sortedHands;
    }
    console.log(handValueDict);

    let sum = 0;
    let currentRank = 1;
    // one more pass to determine the hand value
    for (const handType of Object.keys(handValueDict)) {
        const hands = handValueDict[handType];
        for (let i=0; i<hands.length; i++) {
            const handBid = (hands[i].split(" "))[1];
            sum += (handBid * currentRank);
            currentRank++;
        }
    }
    return sum;
}

// MAIN
const fs = require("fs");

const testFileLoc = process.cwd() + "/src/day7/test-input.txt";
const puzzleFileLoc = process.cwd() + "/src/day7/puzzle-input.txt";

const fileToRun = puzzleFileLoc;

console.log(`Looking for file ${fileToRun}`);
const puzzleFile = fs.readFileSync(fileToRun).toString();

const result = getTotalWinningsAllHands(puzzleFile.split("\n"));
console.log(result);