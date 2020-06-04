!(function () {

    document.addEventListener('DOMContentLoaded', init)

    const css = `
html, body {
margin: 0;
padding: 0;
}
body {
background: rgba(0, 87, 125, 0.3);
display: flex;
flex-direction: column;
}
.topRow {
background: rgba(255, 0, 0, 0.2);
}
.mainRow {
flex: 1;
display: flex;
background: rgba(0, 255, 0, 0.2);
}
.leftCol {
min-width: 12rem;
background: rgba(0, 0, 255, 0.2);
}
.mainCol {
flex: 1;
background: rgba(0, 100, 100, 0.2);
}
`

    function init () {
        const qs = document.querySelector.bind(document)
        const ce = document.createElement.bind(document)
        const ac = (parent, element) => parent.appendChild(element)

        const style = ac(document.head, ce('style'))
        style.innerText = css

        const ui = {
            body: qs('body')
        }
        ui.body.innerHTML = ''
        ui.topRow = ac(ui.body, ce('div'))
        ui.topRow.className = 'topRow'
        ui.topRow.innerText = 'a'
        const mainRow = ac(ui.body, ce('div'))
        mainRow.className = 'mainRow'
        ui.leftCol = ac(mainRow, ce('div'))
        ui.leftCol.className = 'leftCol'
        ui.leftCol.innerText = 'c'
        ui.mainCol = ac(mainRow, ce('div'))
        ui.mainCol.className = 'mainCol'
        ui.mainCol.innerText = 'b'

        const d4 = die(4)
        const d6 = die(6)
        const d8 = die(8)
        const d10 = die(10)
        const d12 = die(12)
        const d20 = die(20)
        const d100 = die(100)
        // for (let i = 0; i < 100; ++i) {
        //     const e = ce('div')
        //     e.innerHTML = `<pre>${JSON.stringify(d6.roll(1))}</pre>`
        //     ui.body.appendChild(e)
        // }
    }

    function assert (result, message) {
        if (!result) {
            throw new Error(message)
        }
    }

    function randomInteger (min, max) {
        assert(min < max, 'min must be lesser than max')
        const interval = max - min
        const r = (interval * Math.random()) | 0
        return min + r
    }

    function range (min, max) {
        assert(min < max, 'min must be lesser than max')
        const diff = max - min
        const result = []
        for (let i = 0; i < diff; ++i) {
            result[i] = min + i
        }
        return result
    }

    function sum (arr) {
        return arr.reduce((acc, n) => acc + n, 0)
    }

    function die (sides) {
        assert(sides > 1, 'the die must have at least two sides')
        return {
            roll(count, {mod} = {mod: 0}) {
                assert(count > 0, 'must roll at least one die')
                const outcomes = range(0, count).map(_ => 1 + randomInteger(0, sides))
                const result = sum(outcomes) + mod
                return {
                    result,
                    outcomes
                }
            }
        }
    }
}());
