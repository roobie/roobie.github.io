const m = require('mithril')
const {tags} = require('./mithril-helpers')
const {stream, scan} = require('flyd')
const {P,S,PS,D} = require('patchinko')
const {addStyle} = require('./styles')
const {chain} = require('./markov-chains.js')
const {setState} = require('./meiosis')

const NameListComp = {
  initialState: () => ({
    items: [], // Array of String
  }),
  actions: (update) => ({
    addName: (id, newName) => setState(id, update, {
      items: S(l => {
        return l.concat(newName)
      }),
    }),
  }),
}

const app = {
  initialState: P(
    {},
    {nameLists: [
      NameListComp.initialState(),
      NameListComp.initialState(),
    ]}
  ),
  actions: (update) => P(
    {},
    {nameList: NameListComp.actions(update)}
  ),
}

const update = stream()
const states = scan((state, patch) => patch(state), app.initialState, update)
const actions = app.actions(update)

function addItem (c) {
  setTimeout(() => {
    const disableSourceWords = false
    let randomWord
    try {
      randomWord = chain.generateWord(3, 10, disableSourceWords)
    } catch (e) {console.error(e)}
    // TODO : what if you could say ...({nameLists: [0]}, randomWord)
    // so what? No increase in ergonomics, really.
    actions.nameList.addName('nameLists.0', randomWord)
    actions.nameList.addName('nameLists.1', randomWord)
    if (c < 10) {
      addItem(c + 1)
    }
  }, 100)
}
addItem(0)

document.addEventListener('DOMContentLoaded', () => {
  addStyle()

  const appRoot = document.createElement('div')
  document.body.appendChild(appRoot)
  const RootComp = {
    view (vnode) {
      const state = vnode.attrs
      const {div, h1, h3} = tags
      return div(
        // h1('Eon - namngenerator'),
        div(
          state.nameLists.map((lst, n) => div(
            // h3(n + 'Cirefaliska namn'),
            h3(n + 'INDEX'),
            div(lst.items.map(w => div(w)))
          ))
        )
      )
    },
  }

  states.map((state) => {
    m.render(appRoot, m(RootComp, state))
  })
})
