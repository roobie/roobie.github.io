const fuji = {
  name: 'Fuji McShan',
  gender: 'F',
  age: 25,
  alignment: ['chaotic', 'neutral'],
  race: 'halfling',
  className: 'monk',
  attrSum: 86,
  attributes: {
    str: '18',
    dex: '13',
    con: '15',
    int: ' 8',
    wis: '17',
    cha: '15'
  },
  derived: {
    ac: 12,
    attackBonus: {
      melee: '4 +0',
      ranged: '1 +0'
    },
    lvl1hp: 10,
    baseAttackBonus: {
      base: '+0',
      lvlup: '+1'
    },
    savingThrowBonus: 4
  }
}

const powerso = {
  name: 'Powerso Teresa',
  gender: 'F',
  age: 150,
  alignment: ['lawful', 'evil'],
  race: 'elf',
  className: 'bard',
  attrSum: 66,
  attributes: {
    str: '12',
    dex: '18',
    con: ' 9',
    int: '13',
    wis: ' 8',
    cha: ' 6'
  },
  derived: {
    ac: 14,
    attackBonus: {
      melee: '1 (excl. BAB)',
      ranged: '4 (excl. BAB)'
    },
    lvl1hp: 5,
    baseAttackBonus: {
      base: '+0',
      perLevel: '+1/2'
    },
    savingThrowBonus: 2
  }
}