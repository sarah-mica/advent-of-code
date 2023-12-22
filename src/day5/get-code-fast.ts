// @ts-nocheck

/*
Trying to speed this up by doing the search in reverse...
*/
const SEEDS = "seeds: ";
const SEEDS_TO_SOIL = "seed-to-soil map:";
const SOIL_TO_FERTILIZER = "soil-to-fertilizer map:";
const FERTILIZER_TO_WATER = "fertilizer-to-water map:";
const WATER_TO_LIGHT = "water-to-light map:";
const LIGHT_TO_TEMP = "light-to-temperature map:";
const TEMP_TO_HUMIDITY = "temperature-to-humidity map:";
const HUMIDITY_TO_LOC = "humidity-to-location map:";


// ex: start with loc 0. 
// then, look for 0 in the location to humiditiy map
function isValidSeedForLoc(location: number): boolean {
    //console.log(`Location: ${location}`);
    const humidity = getMappingDest(locToHumidity, location);
    //console.log(`Humidity: ${humidity}`);
    const temp = getMappingDest(humidityToTemp, humidity);
    //console.log(`Temp: ${temp}`);
    const light = getMappingDest(tempToLight, temp);
    //console.log(`light: ${light}`);
    const water = getMappingDest(lightToWater, light);
    //console.log(`water: ${water}`);
    const fertilizer = getMappingDest(waterToFertilizer, water);
    //console.log(`fertilizer: ${fertilizer}`);
    const soil = getMappingDest(fertilizerToSoil, fertilizer);
    //console.log(`soil: ${soil}`);
    const seed = getMappingDest(soilToSeeds, soil);
    //console.log(`Seed: ${seed}`);

    const keys = Object.keys(seeds);
    for (let i=0; i<seeds.length; i+=2) {
        const seedRangeStart = parseInt(seeds[i]);
        const seedRange = parseInt(seeds[i+1]);
        if (seed >= seedRangeStart && seed < seedRangeStart + seedRange) {
            console.log(`Seed exists! rangeStart: ${seedRangeStart}, range: ${seedRange}`);
            return true;
        }
    }
    return false;
}

function findClosestLocation(): void {
    const locations= Object.keys(locToHumidity).sort();

    // go through every integer, up to the highest location 
    // because an item doesn't have to be in the map to be valid. 
    // only seeds
    for (let i=0; i<locations[locations.length-1]; i++) {
        if (isValidSeedForLoc(i)) {
            return i;
        }
    }

    // for (const location of locations) {
    //     const locationRange = (locToHumidity[location])[1];
    //     const humidityStart = (locToHumidity[location])[0];
    //     for (let j=0; j<locationRange; j++) {
    //         if (isValidSeedForLoc(location, humidityStart)) {
    //             return location;
    //         }
    //     }
    // }

    // should not happen
    return -1;
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

        map[destRangeStart] = [sourceRangeStart, rangeLength];
    }
    return map;
}

// { '0': [ 39, 15 ], '15': [ 0, 37 ], '52': [ 37, 2 ] }, 13
// keys: [0, 15, 52]
function getMappingDest(map: Object, val: number): number {
    let keys = Object.keys(map).map((key) => parseInt(key));
    keys = keys.sort(function(a, b) {
        return a - b;
    });
    if (val < keys[0]) {
        return val;
    }
    const lastEntry = keys[keys.length-1];
    const range = (map[lastEntry])[1];

    if (val >= lastEntry + range) {
        return val;
    }

    for (const key of keys) {
        const sourceRangeStart = parseInt(key);
        const range = (map[key])[1];
        if (val >= sourceRangeStart && val < (sourceRangeStart + range)) {
            const destVal = (map[key])[0];
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
const file = fs.readFileSync(fileToRun).toString();

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
const soilToSeeds = parseMap(file, seedsToSoilIndex + SEEDS_TO_SOIL.length, soilToFertilizerIndex);
const fertilizerToSoil = parseMap(file, soilToFertilizerIndex + SOIL_TO_FERTILIZER.length, fertilizerToWaterIndex);
const waterToFertilizer = parseMap(file, fertilizerToWaterIndex + FERTILIZER_TO_WATER.length, waterToLightIndex);
const lightToWater = parseMap(file, waterToLightIndex + WATER_TO_LIGHT.length, lightToTempIndex);
const tempToLight = parseMap(file, lightToTempIndex + LIGHT_TO_TEMP.length, tempToHumidityIndex);
const humidityToTemp = parseMap(file, tempToHumidityIndex + TEMP_TO_HUMIDITY.length, humidityToLocationIndex);
const locToHumidity = parseMap(file, humidityToLocationIndex + HUMIDITY_TO_LOC.length);

const result = findClosestLocation();

console.log(result);