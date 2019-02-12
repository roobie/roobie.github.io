import {
    translate,
    translateObj
} from './i18n'
import {
    range
} from './helpers'
import {
    die,
    d6,
    d100,
} from './dice'
import {
    getRandomName
} from './random/names'
import {
    pickOne
} from './random/utilities'
import {
    raceData,
    raceNames,
} from './data/races'
import {
    classData,
    classNames,
} from './data/classes'

const alignment1 = [
    'lawful',
    'neutral',
    'chaotic',
]
const alignment2 = [
    'good',
    'neutral',
    'evil',
]

const sizeAcBonuses = {
    small: 1,
    medium: 0
}

export function genDude() {
    const race = (function iter() {
        const result = raceData[pickOne(raceNames)]
        if (Math.random() < result.chance) return result
        return iter()
    })()

    const alignment = [
        pickOne(alignment1),
        pickOne(alignment2),
    ]

    const className = pickOne(classNames)
    const clazz = classData[className]
    const age = race.ageFactor * (die(20) + 18) | 0

    const gender = d100() <= 20 ? 'NB' : d6() <= 3 ? 'M' : 'F'

    const add = (a, b) => a + b
    const rollAttr = (mod) => {
        let dres = range(3)
            .map(d6)
            .sort()
            .reverse()
        // let sumOfThreeBest = dres.slice(0, 3).reduce(add, 0)
        // let preresult = sumOfThreeBest + mod
        let preresult = dres.reduce(add, 0)
        let result = Math.max(preresult, 3) + mod
        return {
            preresult,
            result,
            source: [(mod === 0 ? '±' : mod > 0 ? '+' : '') + mod, dres.join(',')]
        }
    }

    function padLeft(val, padChar, minLen) {
        val = String(val)
        if (val.length < minLen) {
            return new Array(minLen - val.length).join(' ').split(' ').map(_ => padChar) + val
        }
        return val
    }

    const racialMod = (name) => {
        return race.attrs[name] | 0
    }

    let attributes = {
        str: rollAttr(racialMod('str')),
        dex: rollAttr(racialMod('dex')),
        con: rollAttr(racialMod('con')),
        int: rollAttr(racialMod('int')),
        wis: rollAttr(racialMod('wis')),
        cha: rollAttr(racialMod('cha')),
    }

    const bonus = (val) =>
        isNaN(val) || isNaN(val * 2) || val == null ?
        !(() => {
            throw new Error('argument val is not a number')
        })() :
        val <= 3 ? -4 :
        val <= 5 ? -3 :
        val <= 7 ? -2 :
        val <= 9 ? -1 :
        val <= 11 ? 0 :
        val <= 13 ? 1 :
        val <= 15 ? 2 :
        val <= 17 ? 3 :
        val <= 19 ? 4 :
        val <= 21 ? 5 :
        NaN

    const bab = clazz.bab
    let derived = {
        ac: 10 + bonus(attributes.dex.result) + sizeAcBonuses[race.size],
        attackBonus: {
            melee: bonus(attributes.str.result) + ' (excl. BAB)',
            ranged: bonus(attributes.dex.result) + ' (excl. BAB)',
        },
        lvl1hp: clazz.lvl1hp + bonus(attributes.con.result),
        baseAttackBonus: bab,
        savingThrowBonus: 1 + clazz.savingThrowBonus + (race.savingThrowBonus || 0) + Math.floor(
            (
                bonus(attributes.con.result) +
                bonus(attributes.wis.result) +
                bonus(attributes.dex.result)
            ) / 3)
    }

    const attrNames = ['str', 'dex', 'con', 'int', 'wis', 'cha']

    const printableAttributes = {}
    let attrSum = 0
    attrNames.forEach(name => {
        printableAttributes[name] = padLeft(attributes[name].result, ' ', 2)
        attrSum += attributes[name].result
    })

    const abilities = (race.abilities || []).concat(clazz.abilities.lvl1 || []).map(z => translateObj(z, 'ability'))

    const result = {
        name: getRandomName(gender),
        gender: translate(gender === 'NB' ? 'non-binary' : gender === 'M' ? 'male' : 'female'),
        requiredExperienceFactor: race.requiredExpFactor,
        age,
        alignment: translate(alignment),
        race: translate(race.name),
        className: translate(clazz.name),
        attrSum,
        attributes: printableAttributes,
        derived,
        abilities,
        // spells
    }

    let notable = false
    if (attrSum > 80) notable = true
    if (Object.keys(attributes).reduce((out, next) => out || attributes[next].result >= 18, false)) notable = true

    if (notable) console.log(result)
    result.notable = notable

    return result
}


// result = genDude()
// console.log(JSON.stringify(result, null, 2))

// result = range(100).map(genDude)
// fs.writeFileSync('./result.ignore.json', JSON.stringify(result, null, 2))

// range(30).map(() => getRandomName('M')).forEach(x => console.log(x))
// range(30).map(() => getRandomName('F')).forEach(x => console.log(x))

/*
Valer
Cas
Secordan
Nagai
Vada
Lanman

Kizer Leslie
Honidovich Trey
Vladisland Donovich
Oswaldo Robinson
Valentsev Gayle
Gary Per
Hinze Ronald
Cheven Ulricia
Markus David
Berer Couey
Rich Knox
Yesaulov Patri
Danagi Kogane
Polo Afana
Harry Tada
Ryose Barry
Webberg Sawada
Furst Johnnie
Caveliy Igorey
Rathanger Okeeffe
Dyson Cristobal
Stevie Yoshi
Keith Dana
Glenneth Secord
Mahmoud Dolliam
Denan Winford
Marc Kimrey
Danasie Couey
Arms Colin
Wood Andrew
Margan Tama
Kenisha Delsie
Karena Comfortner
Yoria Bonda
Rosarie Gibby
Cindy Kane
Secor Tasha
Gonshiyumi Nolanet
Katensen Toon
Rzhevskaya Nina
Charlys Nadine
Susanna Fabian
Draphing Joyce
Farraham Hicke
Grimmie Rain
Amal Wenda
Aja Rama
Louise Burmeista
Ishiyumi Geschke
Celiya Milissen
Artman Lizzie
Sara Forth
Sandusky Charwenk
Jamine Schalski
Payne Lareen
Cocke Leaney
Canne Karie
Janie Doranora
Seveu Adelin
Kayoko Kayoko
Gord Belano
*/
