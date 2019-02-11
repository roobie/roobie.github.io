export function die(sides) {
    return 1 + ((Math.random() * sides) | 0)
}

export function castExpr(expr) {
    /**
     e.g.
    - castExpr('d20+4')
    - castExpr('4d6-4')
    */
    throw new Error('not implemented')
}

export function extendedCast(diceCount, dieSides, options) {
    const mod = options.mod || 0
    let outcomes = []
    for (let i = 0; i < diceCount; ++i) {
        outcomes.push(die(dieSides))
    }
    if ('top' in options) {
        outcomes.sort().reverse()
        outcomes = outcomes.slice(0, options.top)
    }

    let result = outcomes.reduce((a, b) => a + b, mod)
    if ('max' in options) {
        result = Math.min(options.max, result)
    }
    if ('min' in options) {
        result = Math.max(options.min, result)
    }

    return result
}

export function cast(diceCount, dieSides, mod = 0) {
    let result = mod
    for (let i = 0; i < diceCount; ++i) {
        result += die(dieSides)
    }

    return result
}

export function d4() {
    return die(4)
}

export function d6() {
    return die(6)
}

export function d8() {
    return die(8)
}

export function d10() {
    return die(10)
}

export function d12() {
    return die(12)
}

export function d20() {
    return die(20)
}

export function d100() {
    return die(100)
}