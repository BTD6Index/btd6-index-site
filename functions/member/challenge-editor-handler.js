const NK_API = "https://data.ninjakiwi.com";


export async function getChallenge(challengeCode) {
    const response = await fetch(
        `${NK_API}/btd6/challenges/challenge/${challengeCode}`
    );

    if (!response.ok) {
        throw new Error(`Ninja Kiwi API returned ${response.status}`);
    }

    const json = await response.json();
    return json.body;
}

export function verify2TCSettings(challenge) {
    const errors = [];

    function check(actual, expected, name) {
        if (actual !== expected) {
            errors.push(`${name} Wrong: (E: ${expected}, A: ${actual})`);
        }
    }

    // The Challenge Editor should be set to the hard difficulty and CHIMPS mode.
    check(challenge.difficulty, "Hard", "Difficulty");
    check(challenge.mode, "Clicks", "Mode");

    // Starting Cash, Starting Lives, Max Lives, Start Round, and End Round must be set to their default values.
    check(challenge.startingCash, 650, "Starting Cash");
    check(challenge.lives, 1, "Starting Lives");
    check(challenge.startRound, 6, "Start Round");
    check(challenge.endRound, 100, "End Round");

    // The modifiers included must be No Monkey Knowledge, No Powers, No Continues, No Selling, No Double Cash, and No Fast Track.
    check(challenge.disableMK, true, "No Monkey Knowledge");
    check(challenge.disablePowers, true, "No Powers");
    check(challenge.disableSelling, true, "No Selling");
    check(challenge.disableDoubleCash, true, "No Double Cash");
    check(challenge.noContinues, true, "No Continues");
    // no fast track isn't an option on API rn

    // All sliders must be set to 100%
    check(challenge._bloonModifiers?.speedMultiplier, 1, "Bloon Speed");
    check(challenge._bloonModifiers?.moabSpeedMultiplier, 1, "MOAB Speed");
    check(challenge._bloonModifiers?.healthMultipliers?.bloons, 1, "Bloon Health");
    check(challenge._bloonModifiers?.healthMultipliers?.moabs, 1, "MOAB Health");
    check(challenge._bloonModifiers?.regrowRateMultiplier, 1, "Regrow Rate");
    check(challenge.abilityCooldownReductionMultiplier, 1, "Ability Cooldown");
    check(challenge.removeableCostMultiplier, 1, "Removeable Cost");

    // The modifiers All Camo and All Regrow must be disabled.
    check(challenge._bloonModifiers?.allCamo, false, "All Camo");
    check(challenge._bloonModifiers?.allRegen, false, "All Regrow");

    // check if the api map matches the site map

    // remove spaces and lowercase a map name
    function normalizeName(name) {
        return name
            .replaceAll(" ", "")
            .toLowerCase();
    }

    // check only two towers are allowed 
    const towers = challenge._towers ?? [];
    
    // total tower count must be exactly 2
    const totalTowerCount = towers.reduce((sum, tower) => {
    if (sum === Infinity || tower.max === -1) return Infinity;
        return sum + Math.max(tower.max || 0, 0);
    }, 0);


    if (totalTowerCount !== 2) {
        errors.push(
            `Expected exactly 2 towers allowed in total, got ${totalTowerCount}`
        );
    }
    
    // chosen hero option not allowed
    const chosenHero = towers.find(
        tower => tower.tower === "ChosenPrimaryHero" && tower.max > 0
    );

    if (chosenHero) {
        errors.push("Any Hero option is not allowed");
    }

    const map = challenge.map 

    function getAllowedTier(blocked) {
        // -1 means the path is blocked completely
        if (blocked === -1) {
            return 0;
        }

        return 5 - blocked;
    }
    // format tower to (Super Monkey) (2-2-4) for example
    function formatTower(tower) {
        const name = tower.tower;

        if (tower.isHero) {
            return name;
        }

        const path1 = getAllowedTier(tower.path1NumBlockedTiers);
        const path2 = getAllowedTier(tower.path2NumBlockedTiers);
        const path3 = getAllowedTier(tower.path3NumBlockedTiers);
        return `${name} (${path1}-${path2}-${path3})`;
    }

    const enabledTowers = (challenge._towers ?? [])
        .filter(tower => tower.max > 0)
        .map(formatTower);


    return {
        map: map,
        towers: enabledTowers,
        verified: errors.length === 0,
        errors
    };
}