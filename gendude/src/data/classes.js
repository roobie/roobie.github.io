export const classData = {
    barbarian: {
        name: 'barbarian',
        lvl1hp: 12,
        savingThrowBonus: 1,
        bab: {
            base: '+1',
            perLevel: '+1'
        },
        abilities: {
            lvl1: [{name: 'rage', amount: 1, per: 'day'}],
            lvl4: [{name: 'rage', amount: 2, per: 'day'}],
            lvl5: [{name: 'damage reduction', magnitude: '1/-'}],
            lvl7: [{name: 'rage', amount: 3, per: 'day'}],
        },
    },
    bard: {
        name: 'bard',
        lvl1hp: 6,
        savingThrowBonus: 1,
        bab: {
            base: '+0',
            perLevel: '+1/2'
        },
        abilities: {
            lvl1: [
                'arcane spellcasting',
                {name: 'music', amount: 3, per: 'day'}
            ],
        },
    },
    cleric: {
        name: 'cleric',
        lvl1hp: 6,
        savingThrowBonus: 0,
        bab: {
            base: '+0',
            perLevel: '+3/4'
        },
        abilities: {
            lvl1: ['divine spellcasting'],
        },
    },
    druid: {
        name: 'druid',
        lvl1hp: 6,
        savingThrowBonus: 0,
        bab: {
            base: '+0',
            perLevel: '+1/2'
        },
        abilities: {
            lvl1: ['divine spellcasting'],
        },
    },
    fighter: {
        name: 'fighter',
        lvl1hp: 10,
        savingThrowBonus: 0,
        bab: {
            base: '+1',
            perLevel: '+5/4'
        },
        abilities: {
            lvl1: [],
        },
    },
    mage: {
        name: 'mage',
        lvl1hp: 4,
        savingThrowBonus: 0,
        bab: {
            base: '+0',
            perLevel: '+1/4'
        },
        abilities: {
            lvl1: ['arcane spellcasting'],
        },
    },
    monk: {
        name: 'monk',
        lvl1hp: 8,
        savingThrowBonus: 1,
        bab: {
            base: '+0',
            perLevel: '+1'
        },
        abilities: {
            lvl1: [],
        },
    },
    paladin: {
        name: 'paladin',
        lvl1hp: 10,
        savingThrowBonus: 1,
        bab: {
            base: '+1',
            perLevel: '+1'
        },
        abilities: {
            lvl5: ['divine spellcasting'],
        },
    },
    ranger: {
        name: 'ranger',
        lvl1hp: 8,
        savingThrowBonus: 0,
        bab: {
            base: '+1',
            perLevel: '+1'
        },
        abilities: {
            lvl5: ['divine spellcasting'],
        },
    },
    rogue: {
        name: 'rogue',
        lvl1hp: 6,
        savingThrowBonus: 1,
        bab: {
            base: '+0',
            perLevel: '+3/4'
        },
        abilities: {
            lvl1: [
                {name: 'backstab', amount: 'passive'}
            ],
            lvl5: [{name: 'uncanny dodge', amount: 'passive'}],
        },
    },
}

export const classNames = Object.keys(classData)