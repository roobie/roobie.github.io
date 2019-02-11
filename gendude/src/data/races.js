export const raceData = {
    'dwarf': {
        name: 'dwarf',
        chance: 0.40,
        requiredExpFactor: 1.0,
        ageFactor: 3,
        attrs: {
            con: +2,
            cha: -2
        },
        size: 'small',
        abilities: [
            'darkvision'
        ]
    },
    'wood elf': {
        name: 'wood elf',
        chance: 0.40,
        ageFactor: 5,
        requiredExpFactor: 1.0,
        ageFactor: 3,
        attrs: {
            dex: +1,
            con: -1
        },
        size: 'medium',
        abilities: [
            'night vision',
            'sharp senses (+1 on rolls having to do with the 5 basic senses)'
        ]
    },
    'high elf': {
        name: 'high elf',
        chance: 0.05,
        ageFactor: 10,
        requiredExpFactor: 1.5,
        ageFactor: 3,
        attrs: {
            con: -3,
            int: +3,
            wis: +2,
        },
        size: 'medium',
        abilities: [
            'night vision',
            'fragile (-1 hp)',
        ]
    },
    'drow': {
        name: 'drow',
        chance: 0.15,
        ageFactor: 5,
        requiredExpFactor: 1.2,
        attrs: {
            dex: +1,
            int: +1,
        },
        size: 'medium',
        abilities: [
            'darkvision',
        ]
    },
    'gnome': {
        name: 'gnome',
        chance: 0.25,
        ageFactor: 4,
        requiredExpFactor: 1.4,
        attrs: {
            con: +1,
            int: +2
        },
        size: 'small',
        savingThrowBonus: 1,
        abilities: [
            'darkvision'
        ]
    },
    'half elf': {
        name: 'half elf',
        chance: 0.25,
        ageFactor: 1.5,
        requiredExpFactor: 1.0,
        attrs: {},
        size: 'medium',
    },
    'halfling': {
        name: 'halfling',
        chance: 0.4,
        ageFactor: 1.2,
        requiredExpFactor: 1.0,
        attrs: {
            str: -1,
            dex: +1
        },
        size: 'small',
    },
    'half orc': {
        name: 'half orc',
        chance: 0.6,
        ageFactor: 0.7,
        requiredExpFactor: 1.0,
        attrs: {
            str: +2,
            con: +1,
            cha: -3
        },
        size: 'medium',
        abilities: [
            'darkvision'
        ]
    },
    'goblin': {
        name: 'goblin',
        chance: 0.1,
        ageFactor: 0.4,
        requiredExpFactor: 0.6,
        attrs: {
            str: -2,
            dex: +1,
            con: +1,
            int: -2,
            wis: -2,
            cha: -4,
        },
        size: 'small',
        abilities: [
            'darkvision'
        ]
    },
    'kobold': {
        name: 'kobold',
        chance: 0.1,
        ageFactor: 1.2,
        requiredExpFactor: 0.8,
        attrs: {
            str: -1,
            dex: +3,
            cha: -4,
        },
        size: 'small',
        abilities: [
            'cold blooded'
        ]
    },
    'faerie': {
        name: 'faerie',
        chance: 0.05,
        ageFactor: 1.7,
        requiredExpFactor: 1.2,
        attrs: {
            str: -4,
            dex: +5,
            con: -4,
        },
        size: 'tiny',
        abilities: [
            'wings'
        ]
    },
    'human': {
        name: 'human',
        chance: 1,
        ageFactor: 1,
        requiredExpFactor: 1.0,
        attrs: {},
        size: 'medium',
    },
}

export const raceNames = Object.keys(raceData)