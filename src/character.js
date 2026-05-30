// Central character model for Fallout-Punk sheet
export const character = {
    identity: {
        name: "",
        role: "",
        origin: ""
    },
    stats: {
        INT: {current: 0, max: 0},
        REF: {current: 0, max: 0},
        DEX: {current: 0, max: 0},
        TECH: {current: 0, max: 0},
        COOL: {current: 0, max: 0},
        WILL: {current: 0, max: 0},
        LUCK: {current: 0, max: 0},
        MOVE: {current: 0, max: 0},
        BODY: {current: 0, max: 0},
        EMP: {current: 0, max: 0}
    },
    skills: [] // Array of { skill, statName, statValue, lvl, bonus, total }
};

export function updateCharacter(part, value) {
    // part: 'identity', 'stats', 'skills'
    // value: object to merge
    if (part === 'identity') {
        Object.assign(character.identity, value);
    } else if (part === 'stats') {
        Object.keys(value).forEach(key => {
            if (character.stats[key]) {
                Object.assign(character.stats[key], value[key]);
            }
        });
    } else if (part === 'skills') {
        character.skills = value;
    }
    document.dispatchEvent(new CustomEvent('character-updated', { detail: { character } }));
}
