const m = require('mithril')
const {tags} = require('./mithril-helpers')
const csjs = require('csjs')
const Foswig = require('foswig')

// Create the markov chain and specify the Order of the markov chain.
// The order (an integer > 0) indicates how many previous letters are
// taken into account when selecting the next. A smaller order will
// result in more randomized less recognizeable output. Conversely a
// higher order will result in words which resemble more closely those
// in the original dictionary.
const chain = new Foswig(2)

// add words into the markov chain one at a time
// chain.addWordToChain("random")
const dictionary = require('./corpi/names').cirefalicMaleFirst()
chain.addWordsToChain(dictionary)


const style = csjs`
html,body {margin:0;padding:0;}

html {font-size:20px;}
`
document.addEventListener('DOMContentLoaded', () => {
  const styleEl = document.createElement('style')
  styleEl.innerHTML = csjs.getCss(style)
  document.head.appendChild(styleEl)

  const appRoot = document.createElement('div')
  document.body.appendChild(appRoot)
  m.mount(appRoot, {
    view () {
      const words = []
      const disableSourceWords = false
      for (let i = 0; i < 20; ++i) {
        try {
          const randomWord = chain.generateWord(3, 10, disableSourceWords)
          words.push(randomWord)
        } catch (e) {console.error(e)}
      }
      const {div, h1, h3} = tags
      return div(
        h1('Eon - namngenerator'),
        div(
          h3('Cirefaliska namn'),
          div(words.map(w => div(w)))
        )
      )
    },
  })
})
