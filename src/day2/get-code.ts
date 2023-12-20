// @ts-nocheck

/**
 * The Elf would first like to know which games would have been possible 
 * if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes
 * 
 * Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
 * Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
 * Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
 * Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
 * Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green  
 * 
 * Only 1, 2, and 5
 * 
 * 
 * Then get the sum of those game id's
 */

class Draw {
    public reds: number;
    public blues: number;
    public greens: number;

    public constructor(reds: number, blues: number, greens: number) {
        this.reds = reds;
        this.blues = blues;
        this.greens = greens;
    }
}

class Game {
    public id: number;
    public draws: Draw[];

    public constructor(id: number, draws: Draw[]) {
        this.id = id;
        this.draws = draws;
    }
}

const MAX_BLUES = 14;
const MAX_GREENS = 13;
const MAX_REDS = 12;

function parseGame(puzzleStr: string): Game {
    const gameAndDraws = puzzleStr.split(":");
    const gameId = parseInt(gameAndDraws[0].substring(5));
    const drawsRaw = gameAndDraws[1].split(";");

    let draws: Draw[] = [];
    for (const draw of drawsRaw) {
        let reds = 0, blues = 0, greens = 0;

        const redGreenBlue = draw.split(",");
        for (const color of redGreenBlue) {
            const hasReds = color.indexOf("red");
            const hasBlues = color.indexOf("blue");
            const hasGreens = color.indexOf("green");

            if (hasReds !== -1) {
                reds = parseInt(color.substring(1, hasReds -1));
            } else if (hasBlues !== -1) {
                blues = parseInt(color.substring(1, hasBlues -1));
            } else if (hasGreens !== -1) {
                greens = parseInt(color.substring(1, hasGreens -1));
            }
        }
        const cleanDraw = new Draw(reds, blues, greens);
        console.log(`parsed game: ${gameId}, draw: (reds: ${cleanDraw.reds}, blues: ${cleanDraw.blues}, greens: ${cleanDraw.greens})`);
        draws.push(cleanDraw);
    }

    return new Game(gameId, draws);
}

/**
 * 
 * The Elf would first like to know which games would have been possible 
 * if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes
 * @param game # of reds, greens, and blues
 * @returns 
 */
function isGamePossible(game: Game): boolean {
    for (const draw of game.draws) {
        if (draw.blues > MAX_BLUES) return false;
        if (draw.greens > MAX_GREENS) return false;
        if (draw.reds > MAX_REDS) return false;
    }
    return true;
}

function sumAllPossibleGames(rawPuzzles: string[]): number {
    let sum = 0;

    for (const puzzleStr of rawPuzzles) {
        // parse the game info out of the string
        const game = parseGame(puzzleStr);
        if (isGamePossible(game)) {
            sum += game.id;
            console.log(`Game: ${game.id} is possible!`);
            console.log(puzzleStr);
        }
    }
    return sum;
}

/**
 * Given a game with multiple cube draws, return the minimum set of cubes possible 
 * for this game (ex if one draw yielded 6 red and 2 blue, and the second only 1 red but 3 blue, 
 * the min possible set would be 6 red and 3 blue)
 * @param game 
 */
function getMinPossibleCubes(game: Game): Draw {
    let minReds = 0, minBlues = 0, minGreens = 0;
    for (const draw of game.draws) {
        if (draw.blues > minBlues) minBlues = draw.blues;
        if (draw.reds > minReds) minReds = draw.reds;
        if (draw.greens > minGreens) minGreens = draw.greens;
    }
    return new Draw(minReds, minBlues, minGreens);
}

/**
 * For each game, find the minimum set of cubes it could have been played with,
 * and then take the power of that result (multiply them together).
 * Then take the sum of all the games powers
 * @param rawPuzzles 
 * @returns 
 */
function sumAllGamePowers(rawPuzzles: string[]): number {
    let sum = 0;

    for (const puzzleStr of rawPuzzles) {
        // parse the game info out of the string
        const game: Game = parseGame(puzzleStr);
        const draw: Draw = getMinPossibleCubes(game);
        console.log(puzzleStr);
        console.log(`Game ${game.id} min Possible set: red: ${draw.reds}, blue: ${draw.blues}, green: ${draw.greens}`);
        console.log(`Power: ${draw.reds * draw.blues * draw.greens}`);
        
        sum += draw.reds * draw.blues * draw.greens;
    }
    return sum;
}


// MAIN
const fs = require("fs");

const testFilesLoc = process.cwd() + "/src/day2/test-input.txt";
const puzzlesFileLoc = process.cwd() + "/src/day2/puzzle-input.txt";
const testCubesFileLoc = process.cwd() + "/src/day2/test-cubes.txt";

console.log(`Looking for file ${puzzlesFileLoc}`);
const puzzlesFile = fs.readFileSync(puzzlesFileLoc).toString();
const rawPuzzles = puzzlesFile.split("\n");

const total = sumAllGamePowers(rawPuzzles);
console.log(total);