import m from 'mithril'
import csjs from 'csjs'

import {genDude} from '../dudegen'

function getCols () {
  const result = []
  for (let i = 1; i < 10; ++i) {
    result.push(`.col_${i} {
            flex-direction: column;
            display: flex;
            flex: ${i};
        }`)
  }
  return result.join('\n')
}

export const styles = csjs`
html, body {
    font-size: 20px;
    font-family: fantasy;
}

html, html input, html table {
    font-size: 20px;
    font-family: fantasy;
}

body {
    background-image: url('https://i.imgur.com/ESvn60I.jpg')
}

* {
    box-sizing: border-box;
}

table {
    width: 100%;
    table-layout: fixed;
    flex: 1;
}
table td {
    padding: 1rem;
}

.container {
    display: flex;
    flex-direction: column;
    max-width: 720px;
    margin: 20px auto;
}

.row {
    display: flex;
}

.spaceAround {
  justify-content: space-around;
}

${getCols()}

.sheet {
    border: 10px ridge rgba(37,37,37,0.7);
    padding: 6px;
}
.sheet input {
    border: none;
    border-bottom: 1px solid silver;
}
.sheetSection {
}

button {
  border: 5px outset navy;
  background: transparent;
  background-color: transparent;
  color: white;
}
.guardOverflow {
  overflow: scroll;
}

.bio extends .col_1, .sheetSection { }
.metaInfo extends .col_1, .sheetSection { }
.classesInfo extends .col_1, .sheetSection { }
.attrsInfo extends .col_1, .sheetSection {
    max-width: 500px;
}

.spacer {
    min-height: 20px;
    height: 20px;
}

.alignRight {
    text-align: right;
}
.numberField extends .alignRight {}

.bg,
.bg label, .bg table {
    background: rgba(12,12,12,0.5);
    color: #eee;
}
.bg input {
    background: rgba(12,12,12,0.8);
    color: #eee;
}
`

function translateAlignment (a) {
  const aa = {
    'chaotic': 'kaotisk',
    'neutral': 'neutral',
    'lawful': 'laglydig',
    'good': 'god',
    'evil': 'ond',
  }
  return a.map(x => aa[x]).join(' och ')
}

export default class ChSheetComp {
  static styles () {
    return styles
  }

  constructor (vnode) {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'n') {
        this.char = genDude()
        m.redraw();
      }
    })
    this.char = vnode.attrs.character
  }

  view (vnode) {
    return m('div', {className: `${styles.container} ${styles.bg}`}, [
      m('div', {className: `${styles.sheet} ${styles.row} ${styles.spaceAround}`}, [
        m('button', {
          type: 'button',
          onclick: (e) => {
            this.char = genDude()
          }
        }, 'Ny gubbe, tack!'),
        m('button', {
          type: 'button',
          onclick: (e) => {
            localStorage.setItem('gubbe', JSON.stringify(this.char))
          }
        }, 'Spara denna gubbe temporärt'),
        m('button', {
          type: 'button',
          onclick: (e) => {
            this.char = JSON.parse(localStorage.getItem('gubbe'))
          }
        }, 'Återställ sparad gubbe'),
      ]),
      m('div', {className: `${styles.sheet} ${styles.row}`}, [
        m('div', {className: styles.bio}, [
          m('table', [
            m('tbody', [
              m('tr', [
                m('td', 'namn'),
                m('td', m('input', {type: 'text', value: this.char.name})),
              ]),
              m('tr', [
                m('td', 'kön'),
                m('td', m('input', {type: 'text', value: this.char.gender})),
              ]),
            ])
          ])
        ]),
      ]),

      m('div', {className: `${styles.sheet} ${styles.row}`}, [
        m('div', {className: styles.metaInfo}, [
          m('table', [
            m('tbody', [
              m('tr', [
                m('td', 'övertyglese'),
                m('td', m('input', {type: 'text', value: translateAlignment(this.char.alignment)})),
              ]),
              m('tr', [
                m('td', 'ras/folkslag'),
                m('td', m('input', {type: 'text', value: this.char.race})),
              ]),
            ])
          ])
        ]),
      ]),

      m('div', {className: `${styles.sheet} ${styles.row}`}, [
        m('div', {className: styles.classesInfo}, [
          m('table', [
            m('tbody', [
              m('tr', [
                m('td', 'klass/yrke'),
                m('td', m('input', {type: 'text', value: this.char.className})),
              ]),
            ])
          ])
        ]),
      ]),

      m('div', {className: `${styles.spacer} ${styles.row}`}, [
        m('hr')
      ]),

      m('div', {className: `${styles.sheet} ${styles.row} ${styles.spaceAround}`}, [
        m('div', {className: styles.attrsInfo}, [
          m('table', [
            m('caption', 'Primära attribut'),
            m('tbody', [
              m('tr', [
                m('td', 'styrka'),
                m('td', '(str)'),
                m('td', {className: styles.numberField}, this.char.attributes.str)
              ]),
              m('tr', [
                m('td', 'smidighet'),
                m('td', '(dex)'),
                m('td', {className: styles.numberField}, this.char.attributes.dex)
              ]),
              m('tr', [
                m('td', 'uthållighet'),
                m('td', '(con)'),
                m('td', {className: styles.numberField}, this.char.attributes.con)
              ]),
              m('tr', [
                m('td', 'minne'),
                m('td', '(int)'),
                m('td', {className: styles.numberField}, this.char.attributes.int)
              ]),
              m('tr', [
                m('td', 'visdom'),
                m('td', '(wis)'),
                m('td', {className: styles.numberField}, this.char.attributes.wis)
              ]),
              m('tr', [
                m('td', 'utstrålning'),
                m('td', '(cha)'),
                m('td', {className: styles.numberField}, this.char.attributes.cha)
              ]),
              m('tr', [
                m('td', ''),
              ]),
              m('tr', [
                m('td', 'summa, attribut'),
                m('td', ''),
                m('td', {className: styles.numberField},
                  Object.keys(this.char.attributes)
                  .map(x => parseInt(this.char.attributes[x], 10))
                  .reduce((a, b) => a + b, 0))
              ]),
            ])
          ])
        ]),
      ]),

      m('div', {className: `${styles.spacer} ${styles.row}`}, [
        m('hr')
      ]),

      m('div', {className: `${styles.sheet} ${styles.row} ${styles.spaceAround}`}, [
        m('div', {className: styles.attrsInfo}, [
          m('table', [
            m('caption', 'Deriverade attribut'),
            m('tbody', [
              m('tr', [
                m('td', 'XP per nivå modifikation'),
                m('td', ''),
                m('td', {className: styles.numberField}, this.char.requiredExperienceFactor)
              ]),
              m('tr', [
                m('td', 'Hälsopoäng (nivå 1)'),
                m('td', '(HP)'),
                m('td', {className: styles.numberField}, this.char.derived.lvl1hp)
              ]),
              m('tr', [
                m('td', 'Rustningsklass (nivå 1)'),
                m('td', '(AC)'),
                m('td', {className: styles.numberField}, this.char.derived.ac)
              ]),
              m('tr', [
                m('td', 'Attackbonus, närstrid (nivå 1)'),
                m('td', '(AB, Melee)'),
                m('td', {className: styles.numberField}, this.char.derived.attackBonus.melee)
              ]),
              m('tr', [
                m('td', 'Attackbonus, avstånd (nivå 1)'),
                m('td', '(AB, Ranged)'),
                m('td', {className: styles.numberField}, this.char.derived.attackBonus.ranged)
              ]),
              m('tr', [
                m('td', 'Attackbonus, bas (nivå 1)'),
                m('td', '(BAB)'),
                m('td', {className: styles.numberField}, this.char.derived.baseAttackBonus.base)
              ]),
              m('tr', [
                m('td', 'Attackbonus, per nivå'),
                m('td', '(BAB, per level)'),
                m('td', {className: styles.numberField}, this.char.derived.baseAttackBonus.perLevel)
              ]),
              m('tr', [
                m('td', 'Räddningskast (nivå 1)'),
                m('td', '(Saving throw bonus)'),
                m('td', {className: styles.numberField}, this.char.derived.baseAttackBonus.savingThrowBonus)
              ]),
            ]),
          ]),
        ]),
      ]),
      m('div', {className: `${styles.spacer} ${styles.row}`}, [
        m('hr')
      ]),

      m('div', {className: `${styles.sheet} ${styles.row} ${styles.spaceAround}`}, [
        m('div', {className: styles.attrsInfo}, [
          m('table', [
            m('caption', 'Förmågor'),
            m('tbody', this.char.abilities.map(ab => {
              return m('tr', [
                  m('td', ab)
                ])
            })),
          ]),
        ]),
      ]),
      m('div', {className: ''}),

      m('div', {className: ''}, [
        m('h3', 'Tips'),
        m('ul', [
          m('li', 'Du kan trycka på tangenten N för att få en ny gubbe'),
          m('li', 'Nedan är din gubbe serialiserad - alltså i ett data format som program kan läsa. Enkelt sätt att spara resultatet på'),
        ])
      ]),

      m('div', {className: ""}, [
        m('textarea', {
          style: "width:100%;height:150px;background:transparent;color:#ddd;",
          value: JSON.stringify(this.char, null, 2)
        })
      ]),
    ])
  }
}
