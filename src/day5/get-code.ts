// @ts-nocheck

/*
The almanac (your puzzle input) lists all of the seeds that need to be planted. 
It also lists what type of soil to use with each kind of seed, what type of fertilizer to use with each kind of soil, 
what type of water to use with each kind of fertilizer, and so on. Every type of seed, soil, fertilizer and so on 
is identified with a number, but numbers are reused by each category - that is, soil 123 and fertilizer 123 
aren't necessarily related to each other.

For example:
--------------------------------------------------
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
--------------------------------------------------

The almanac starts by listing which seeds need to be planted: seeds 79, 14, 55, and 13.

The rest of the almanac contains a list of maps which describe how to convert numbers from a source category 
into numbers in a destination category. That is, the section that starts with seed-to-soil map: describes how
to convert a seed number (the source) to a soil number (the destination). This lets the gardener and his team 
know which soil to use with which seeds, which water to use with which fertilizer, and so on.

Rather than list every source number and its corresponding destination number one by one, the maps describe entire 
ranges of numbers that can be converted. Each line within a map contains three numbers: the destination range start,
the source range start, and the range length.

Consider again the example seed-to-soil map:
------------------------------------------------------------------
dest range start    source range start    range length 
50                  98                    2
52                  50                    48
------------------------------------------------------------------

The first line has a destination range start of 50, a source range start of 98, and a range length of 2. 
This line means that the source range starts at 98 and contains two values: 98 and 99. The destination 
range is the same length, but it starts at 50, so its two values are 50 and 51. With this information, 
you know that seed number 98 corresponds to soil number 50 and that seed number 99 corresponds to soil number 51.

The second line means that the source range starts at 50 and contains 48 values: 50, 51, ..., 96, 97. 
This corresponds to a destination range starting at 52 and also containing 48 values: 52, 53, ..., 98, 99. 
So, seed number 53 corresponds to soil number 55.

Any source numbers that aren't mapped correspond to the same destination number. 
So, seed number 10 corresponds to soil number 10.


The gardener and his team want to get started as soon as possible, so they'd like to know the closest location 
that needs a seed. 

Using these maps, find the lowest location number that corresponds to any of the initial seeds. 
To do this, you'll need to convert each seed number through other categories until you can find its corresponding 
location number.
*/
const SEEDS = "seeds: ";
const SEEDS_TO_SOIL = "seed-to-soil map:";
const SOIL_TO_FERTILIZER = "soil-to-fertilizer map:";
const FERTILIZER_TO_WATER = "fertilizer-to-water map:";
const WATER_TO_LIGHT = "water-to-light map:";
const LIGHT_TO_TEMP = "light-to-temperature map:";
const TEMP_TO_HUMIDITY = "temperature-to-humidity map:";
const HUMIDITY_TO_LOC = "humidity-to-location map:";

function parseAlmanac(file: string): void {
    const seedsIndex = file.indexOf(SEEDS);
    const seedsToSoilIndex = file.indexOf(SEEDS_TO_SOIL);
    const soilToFertilizerIndex = file.indexOf(SOIL_TO_FERTILIZER);
    const fertilizerToWaterIndex = file.indexOf(FERTILIZER_TO_WATER);
    const waterToLightIndex = file.indexOf(WATER_TO_LIGHT);
    const lightToTempIndex = file.indexOf(LIGHT_TO_TEMP);
    const tempToHumidityIndex = file.indexOf(TEMP_TO_HUMIDITY);
    const humidityToLocationIndex = file.indexOf(HUMIDITY_TO_LOC);

    let seeds = file.substring(seedsIndex + SEEDS.length, seedsToSoilIndex).split(" ");

    seeds = seeds.map((seedStr) => parseInt(seedStr));
    console.log(`SEEDS: ${seeds}`);
    const seedsToSoil = parseMap(file, seedsToSoilIndex + SEEDS_TO_SOIL.length, soilToFertilizerIndex);
    const soilToFertilizer = parseMap(file, soilToFertilizerIndex + SOIL_TO_FERTILIZER.length, fertilizerToWaterIndex);
    const fertilizerToWater = parseMap(file, fertilizerToWaterIndex + FERTILIZER_TO_WATER.length, waterToLightIndex);
    const waterToLight = parseMap(file, waterToLightIndex + WATER_TO_LIGHT.length, lightToTempIndex);
    const lightToTemp = parseMap(file, lightToTempIndex + LIGHT_TO_TEMP.length, tempToHumidityIndex);
    const tempToHumidity = parseMap(file, tempToHumidityIndex + TEMP_TO_HUMIDITY.length, humidityToLocationIndex);
    const humidityToLocation = parseMap(file, humidityToLocationIndex + HUMIDITY_TO_LOC.length);

    let locations = [];
    for (const seed of seeds) {
        console.log(`SEED: ${seed}`);
        const soil = getMappingDest(seedsToSoil, seed);
        console.log(`SOIL: ${soil}`);
        const fertilizer = getMappingDest(soilToFertilizer, soil);
        console.log(`FERT: ${fertilizer}`);
        const water = getMappingDest(fertilizerToWater, fertilizer);
        console.log(`WATER: ${water}`);
        const light  = getMappingDest(waterToLight, water);
        console.log(`LIGHT: ${light}`);
        const temp = getMappingDest(lightToTemp, light);
        console.log(`TEMP: ${temp}`);
        const humidity = getMappingDest(tempToHumidity, temp);
        console.log(`HUMIDITY: ${humidity}`);
        const loc = getMappingDest(humidityToLocation, humidity);
        console.log(`LOC: ${loc}`);
        locations.push(loc);
    }
    return Math.min(...locations);
}

/**
 * 
 * Consider again the example seed-to-soil map:
------------------------------------------------------------------
dest range start    source range start    range length 
50                  98                    2
52                  50                    48
------------------------------------------------------------------
 * @param file 
 * @param startIndex 
 * @param endIndex 
 */
function parseMap(file: string, startIndex: number, endIndex: number): Object {
    const lines = file.substring(startIndex, endIndex).split("\n");
    let map = {};

    for (const line of lines) {
        const split = line.split(" ");
        if (split.length < 3) continue;

        const destRangeStart = parseInt(split[0]);
        const sourceRangeStart = parseInt(split[1]);
        const rangeLength = parseInt(split[2]);
        console.log(`destStart: ${destRangeStart}, sourceStart: ${sourceRangeStart}, range: ${rangeLength}`);

        map[sourceRangeStart] = [destRangeStart, rangeLength];
    }
    return map;
}

// { '0': [ 39, 15 ], '15': [ 0, 37 ], '52': [ 37, 2 ] }, 13
// keys: [0, 15, 52]
function getMappingDest(map: Object, val: number): number {
    const keys = Object.keys(map);
    for (const key of keys) {
        const sourceRangeStart = parseInt(key);
        const range = (map[key])[1];
        if (val >= sourceRangeStart && val <= (sourceRangeStart + range)) {
            const destVal = (map[key])[0];
            console.log(`Found destination: ${destVal}, val: ${val}, key: ${key}`)
            return destVal + (val - sourceRangeStart);
        }
    }
    return val;
}

// MAIN
const fs = require("fs");

const testFileLoc = process.cwd() + "/src/day5/test-input.txt";
const puzzleFileLoc = process.cwd() + "/src/day5/puzzle-input.txt";

const fileToRun = puzzleFileLoc;

console.log(`Looking for file ${fileToRun}`);
const puzzleFile = fs.readFileSync(fileToRun).toString();

const result = parseAlmanac(puzzleFile);
console.log(result);